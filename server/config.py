from zoneinfo import ZoneInfo
from datetime import timedelta

DEV_MODE = True
SECRET_KEY = 'otSSRRBUWUvVU6hu7RnfJG2CHgaOc5ENy3pBO7nNlqxvJ1c9M3lEU9wP0vLOSkyY'
JWT_ENCR_ALGORITHM = 'HS256'
TOKEN_TIMEOUT_TD = timedelta(days=7)
TIMEZONE = ZoneInfo('UTC')
