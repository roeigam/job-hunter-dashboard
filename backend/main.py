from fastapi import FastAPI

app = FastAPI(title="Job Hunter Dashboard")


@app.get("/")
def home():
    return {"message": "Job Hunter Dashboard API is running"}
    

@app.get("/health")
def health():
    return {"status": "ok"}