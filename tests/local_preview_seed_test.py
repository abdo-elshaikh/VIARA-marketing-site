import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('local_preview_store', ROOT / 'scripts' / 'local-preview-store.py')
store = importlib.util.module_from_spec(spec)
spec.loader.exec_module(store)


class LocalPreviewSeedTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        store.ROOT = self.root
        store.LOCAL_ROOT = self.root / '.wrangler' / 'state' / 'v3' / 'd1'
        store.LOCAL_ROOT.mkdir(parents=True)
        self.path = store.LOCAL_ROOT / 'preview.sqlite'
        with contextlib.closing(sqlite3.connect(self.path)) as db, db:
            for migration in sorted((ROOT / 'drizzle').glob('*.sql')):
                db.executescript(migration.read_text(encoding='utf-8'))
            db.execute("INSERT INTO site_settings VALUES('main',?,3,'owner',1)", (json.dumps({'brand': 'before'}),))
            db.execute("INSERT INTO inquiries(id,user_id,name,email,phone,organization,facility,branches,interest,plan,message,created_at) VALUES('existing','owner','Existing','owner@example.invalid','12345678','Center','radiology','one','RIS','none','Keep me',1)")
            db.execute("INSERT INTO reviews(id,user_id,name,role,organization,quote,rating,locale,status,consent,created_at) VALUES('review','owner','Existing','','Center','Keep review',5,'en','approved',1,1)")
        self.fixture = {'name': 'Preview only', 'email': 'preview@example.invalid', 'phone': '+12025550101', 'organization': 'Preview', 'facility': 'radiology', 'branches': 'one', 'interest': 'PACS', 'plan': 'none', 'message': 'Synthetic', 'status': 'new', 'locale': 'en'}

    def tearDown(self):
        self.temp.cleanup()

    def apply(self, version=3, previous=None, fixture=None):
        payload = {'version': version, 'previous': previous or {'brand': 'before'}, 'content': {'brand': 'after'}, 'inquiries': [fixture or self.fixture]}
        argv, stdin = sys.argv, sys.stdin
        try:
            sys.argv = ['local-preview-store.py', 'apply']
            sys.stdin = io.StringIO(json.dumps(payload))
            with contextlib.redirect_stdout(io.StringIO()):
                store.main()
        finally:
            sys.argv, sys.stdin = argv, stdin

    def test_seed_archives_content_preserves_customer_records_and_does_not_duplicate_fixtures(self):
        self.apply()
        self.apply(version=4, previous={'brand': 'after'})
        with contextlib.closing(sqlite3.connect(self.path)) as db:
            self.assertEqual(db.execute("SELECT version FROM site_settings WHERE key='main'").fetchone()[0], 5)
            self.assertEqual(db.execute('SELECT COUNT(*) FROM site_revisions').fetchone()[0], 2)
            self.assertEqual(db.execute("SELECT message FROM inquiries WHERE id='existing'").fetchone()[0], 'Keep me')
            self.assertEqual(db.execute("SELECT quote FROM reviews WHERE id='review'").fetchone()[0], 'Keep review')
            self.assertEqual(db.execute("SELECT COUNT(*) FROM inquiries WHERE user_id='local-preview-fixture'").fetchone()[0], 1)
        self.assertEqual(len(list((self.root / '.wrangler' / 'preview-backups').glob('*.json'))), 2)

    def test_conflicts_and_mid_transaction_errors_leave_the_original_content_untouched(self):
        with self.assertRaises(RuntimeError):
            self.apply(version=2)
        broken = dict(self.fixture)
        del broken['message']
        with self.assertRaises(KeyError):
            self.apply(fixture=broken)
        with contextlib.closing(sqlite3.connect(self.path)) as db:
            self.assertEqual(db.execute("SELECT version FROM site_settings WHERE key='main'").fetchone()[0], 3)
            self.assertEqual(db.execute('SELECT COUNT(*) FROM site_revisions').fetchone()[0], 0)
            self.assertEqual(db.execute('SELECT COUNT(*) FROM inquiries').fetchone()[0], 1)


if __name__ == '__main__':
    unittest.main()
