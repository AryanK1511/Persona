from database.mongo import Mongo

class Permission:
    def __init__(self):
        self.mongo = Mongo()

    def check_permission(self, user_id, intent):

    