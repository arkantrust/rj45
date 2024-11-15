from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import RedirectResponse

import models
# from auth.auth import router as auth_router
# from auth.auth import get_current_user


app = FastAPI()
# app.include_router(auth_router)


# Reroute / to /docs because this app doesn't have a frontend here.
@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")

@app.post("/")
def get_analytics():
    return "Hello, Analytics!"