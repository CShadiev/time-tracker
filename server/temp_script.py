from api_schemas import session
from random import choice
from random import randint
import datetime as dt
from uuid import uuid4
from mysql_server import database
from mysql_server.schemas import DBSession
from sqlalchemy.orm import joinedload
from sqlalchemy import select


def generate_demo_sessions():
    START_DATE = dt.datetime(2023, 7, 1)
    N_DAYS = 360

    user = "demo"
    task_id_list = [
        "11023e87-32da-4850-a941-902acaf4684b",
        "3c14d488-4a23-4ca1-b55b-8481c7ad198b",
        "475a2f4a-3b32-4e64-86e2-57b1d0efe7f2",
        "4b0dd318-0996-441c-88ce-b00ca6c12fc0",
        "6532bfac-9ad3-4a08-af54-1e8494e07deb",
        "80e64c53-b952-4767-92f5-c43390ad66f2",
        "977961ad-bf21-40dc-823d-1e1d4e814cf8",
        "fd961370-ae55-497f-90d9-d52f1b81fb12",
    ]

    for i in range(N_DAYS):
        n_tasks = randint(4, 7)
        for j in range(n_tasks):
            task_id = choice(task_id_list)
            completed_at = START_DATE + dt.timedelta(days=i, minutes=randint(9, 18) * 60)

            key = str(uuid4())
            duration = randint(3, 8) * 10 * 60
            session.create(
                key=key,
                task_id=task_id,
                completed_at=completed_at,
                duration=duration,
                user=user,
            )

        print(f"Day {i+1} of {N_DAYS} done.")


if __name__ == "__main__":
    with database.create_session() as s:
        res = s.execute(select(DBSession)).scalar()
        if res is not None:
            print(res.__dict__)
