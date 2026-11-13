"""Read/write the checkout's existing local preview database only."""
import datetime
from contextlib import closing
import hashlib
import json
from pathlib import Path
import sqlite3
import sys
import time
import uuid

ROOT = Path(__file__).resolve().parent.parent
LOCAL_ROOT = (ROOT / '.wrangler' / 'state' / 'v3' / 'd1').resolve()


def locate_database():
    matches = []
    for path in LOCAL_ROOT.rglob('*.sqlite'):
        target = path.resolve()
        if not target.is_relative_to(LOCAL_ROOT) or path.name == 'metadata.sqlite':
            continue
        with closing(sqlite3.connect(target.as_uri() + '?mode=ro', uri=True)) as db:
            tables = {row[0] for row in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
            if {'site_settings', 'site_revisions', 'inquiries', 'reviews'} <= tables:
                matches.append(target)
    if len(matches) != 1:
        raise RuntimeError('Expected exactly one initialized local preview database')
    return matches[0]


def digest(db, table, excluded_user=None):
    query = 'SELECT * FROM ' + table
    args = ()
    if excluded_user:
        query += ' WHERE user_id != ?'
        args = (excluded_user,)
    rows = db.execute(query + ' ORDER BY id', args).fetchall()
    return hashlib.sha256(json.dumps(rows, ensure_ascii=False).encode()).hexdigest()


def main():
    path = locate_database()
    with closing(sqlite3.connect(path.as_uri() + '?mode=rw', uri=True, timeout=10)) as db:
        db.row_factory = None
        row = db.execute("SELECT value,version,updated_by,updated_at FROM site_settings WHERE key='main'").fetchone()
        if not row:
            raise RuntimeError('No saved content; initialize the preview before seeding')
        if sys.argv[1:] == ['snapshot']:
            print(json.dumps({'content': json.loads(row[0]), 'version': row[1]}))
            return
        if sys.argv[1:] != ['apply']:
            raise RuntimeError('Use snapshot or apply')
        payload = json.load(sys.stdin)
        db.execute('BEGIN IMMEDIATE')
        current = db.execute("SELECT value,version,updated_by,updated_at FROM site_settings WHERE key='main'").fetchone()
        if current[1] != payload['version'] or json.loads(current[0]) != payload['previous']:
            raise RuntimeError('Content changed during preparation; rerun the seed command')
        before_requests = digest(db, 'inquiries', 'local-preview-fixture')
        before_reviews = digest(db, 'reviews')
        now = int(time.time() * 1000)
        backup_dir = ROOT / '.wrangler' / 'preview-backups'
        backup_dir.mkdir(parents=True, exist_ok=True)
        stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
        backup = backup_dir / ('content-v' + str(current[1]) + '-' + stamp + '.json')
        backup.write_text(json.dumps({'content': json.loads(current[0]), 'version': current[1], 'updatedBy': current[2], 'updatedAt': current[3]}, ensure_ascii=False, indent=2), encoding='utf-8')
        db.execute('INSERT INTO site_revisions(id,version,value,updated_by,created_at) VALUES(?,?,?,?,?)', (str(uuid.uuid4()), current[1], current[0], current[2], now))
        version = current[1] + 1
        db.execute("UPDATE site_settings SET value=?,version=?,updated_by=?,updated_at=? WHERE key='main' AND version=?", (json.dumps(payload['content'], ensure_ascii=False), version, 'local-preview-seed', now, current[1]))
        for index, fixture in enumerate(payload['inquiries']):
            record_id = str(uuid.uuid5(uuid.NAMESPACE_URL, 'viara-local-preview-v1/inquiry/' + str(index)))
            values = (record_id, 'local-preview-fixture', fixture['name'], fixture['email'], fixture['phone'], fixture['organization'], fixture['facility'], fixture['branches'], fixture['interest'], fixture['plan'], fixture['message'], fixture['status'], fixture['locale'], '', now - index * 86400000)
            db.execute('''INSERT INTO inquiries(id,user_id,name,email,phone,organization,facility,branches,interest,plan,message,status,locale,offer,created_at)
              VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
              name=excluded.name,email=excluded.email,phone=excluded.phone,organization=excluded.organization,facility=excluded.facility,branches=excluded.branches,interest=excluded.interest,plan=excluded.plan,message=excluded.message,status=excluded.status,locale=excluded.locale,created_at=excluded.created_at
              WHERE inquiries.user_id='local-preview-fixture' ''', values)
        if digest(db, 'inquiries', 'local-preview-fixture') != before_requests or digest(db, 'reviews') != before_reviews:
            raise RuntimeError('Existing customer records changed; rolling back')
        db.commit()
        print(json.dumps({'version': version, 'backup': str(backup.relative_to(ROOT)), 'previewRequests': len(payload['inquiries']), 'existingCustomerRecordsPreserved': True, 'database': str(path.relative_to(ROOT))}))


if __name__ == '__main__':
    main()
