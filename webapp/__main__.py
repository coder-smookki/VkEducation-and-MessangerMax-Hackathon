import uvicorn

from webapp.application import app


def main():
    uvicorn.run(app=app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
