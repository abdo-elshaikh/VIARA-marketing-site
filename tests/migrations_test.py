import sqlite3
import unittest
from pathlib import Path

DRIZZLE_DIR = Path(__file__).resolve().parent.parent / 'drizzle'

class MigrationTests(unittest.TestCase):
    def test_existing_requests_survive_schema_upgrade(self):
        db=sqlite3.connect(':memory:')
        paths=sorted(DRIZZLE_DIR.glob('*.sql'))
        db.executescript(paths[0].read_text())
        db.execute("INSERT INTO inquiries (id,user_id,name,email,phone,organization,facility,branches,interest,plan,message,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",('legacy','owner','Example','sample@example.com','12345678','Example center','مركز أشعة','فرع واحد','RIS','أساس','',1))
        for path in paths[1:]: db.executescript(path.read_text())
        self.assertEqual(db.execute("SELECT user_id,locale,offer FROM inquiries WHERE id='legacy'").fetchone(),('owner','ar',''))
        tables={r[0] for r in db.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        self.assertTrue({'site_settings','reviews','inquiries','site_revisions'}<=tables)
        db.close()
    def test_legacy_reviews_remain_unattributed_and_scoped_reviews_filter_correctly(self):
        db=sqlite3.connect(':memory:')
        paths=sorted(DRIZZLE_DIR.glob('*.sql'))
        for path in paths[:2]: db.executescript(path.read_text())
        db.execute("INSERT INTO reviews VALUES ('legacy','guest','Existing user','','Clinic','Existing review',5,'en','approved',1,1)")
        for path in paths[2:]: db.executescript(path.read_text())
        self.assertEqual(db.execute("SELECT quote,system_id FROM reviews WHERE id='legacy'").fetchone(),('Existing review',None))
        for review_id,system_id,status in [('pacs','PACS','approved'),('lis','LIS','approved'),('pending','PACS','pending')]:
            db.execute("INSERT INTO reviews (id,user_id,name,role,organization,quote,rating,locale,status,consent,created_at,system_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",(review_id,'guest','Test user','','Clinic','Test review',4,'en',status,1,2,system_id))
        self.assertEqual(db.execute("SELECT id FROM reviews WHERE status='approved' AND system_id='PACS'").fetchall(),[('pacs',)])
        db.close()
    def test_content_revisions_cannot_be_overwritten_by_stale_editor(self):
        db=sqlite3.connect(':memory:')
        for path in sorted(DRIZZLE_DIR.glob('*.sql')): db.executescript(path.read_text())
        db.execute("INSERT INTO site_settings VALUES ('main','{}',1,'owner',1)")
        first=db.execute("UPDATE site_settings SET version=2,value='new' WHERE key='main' AND version=1").rowcount
        stale=db.execute("UPDATE site_settings SET version=2,value='stale' WHERE key='main' AND version=1").rowcount
        self.assertEqual((first,stale),(1,0))
        self.assertEqual(db.execute("SELECT value FROM site_settings").fetchone()[0],'new')
        db.close()
if __name__=='__main__': unittest.main()
