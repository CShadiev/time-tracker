from mysql_server import database
from mysql_server.base import MySQLServerBase


def main():
    with database.create_session() as session:
        if session.bind:
            tables = [t for t in reversed(
                MySQLServerBase.metadata.sorted_tables)]
            MySQLServerBase.metadata.drop_all(
                session.bind, tables=tables)
            MySQLServerBase.metadata.create_all(
                session.bind)

        else:
            raise ValueError(
                'session.bind cannot be None to execute '
                'this operation.')
