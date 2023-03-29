from typing import Annotated
from fastapi import Depends, FastAPI, Response
from fastapi.security import OAuth2PasswordBearer
from api_schemas import SignRequest
from api_schemas import user as user_api


app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')


@app.post('/sign_up')
async def sign_up(data: SignRequest):
    user = user_api.create_user(data.username, data.password)
    user.sign_up()
    return Response(status_code=201)


@app.get('/token')
async def sign_in(data: SignRequest):
    pass


@app.get('/sample')
async def read_items(token: Annotated[str, Depends(oauth2_scheme)]):
    pass
