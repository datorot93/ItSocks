import os

PROJECT_NAME = "ItSocks"

user = os.getenv("POSTGRES_USER", "postgres")
password = os.getenv("POSTGRES_PASSWORD", "")
server = os.getenv("POSTGRES_SERVER", "db")
db = os.getenv("POSTGRES_DB", "app")

aws_access_key = os.getenv("AWS_ACCESS_KEY")
aws_secret_key = os.getenv("AWS_SECRET_KEY")
aws_region_name = os.getenv("AWS_REGION_NAME")
aws_bucket_name = os.getenv("AWS_BUCKET_NAME")


SQLALCHEMY_DATABASE_URI = f"postgresql://{user}:{password}@{server}/{db}"

API_V1_STR = "/api/v1"
LOCAL_FILES = "files/"
