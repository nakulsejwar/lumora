import os
import logging
import cloudinary
import cloudinary.uploader

logger = logging.getLogger(__name__)

def is_cloudinary_configured():
    cloudinary_url = os.getenv('CLOUDINARY_URL')
    cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME')
    api_key = os.getenv('CLOUDINARY_API_KEY')
    api_secret = os.getenv('CLOUDINARY_API_SECRET')

    if cloudinary_url:
        return True
    if cloud_name and api_key and api_secret:
        return True
    return False

def configure_cloudinary():
    if not is_cloudinary_configured():
        return False

    cloudinary_url = os.getenv('CLOUDINARY_URL')
    if cloudinary_url:
        cloudinary.config(cloudinary_url=cloudinary_url)
    else:
        cloudinary.config(
            cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
            api_key=os.getenv('CLOUDINARY_API_KEY'),
            api_secret=os.getenv('CLOUDINARY_API_SECRET'),
            secure=True
        )
    return True

def upload_file_to_cloudinary(file_obj, filename=None, folder="lumora_courses"):
    """
    Uploads a file object to Cloudinary.
    Returns the secure CDN URL (https://res.cloudinary.com/...).
    """
    if not configure_cloudinary():
        environment = os.getenv('NEXT_PUBLIC_ENVIRONMENT') or os.getenv('ENVIRONMENT')
        is_production = environment in ['main', 'production']

        if is_production:
            logger.error("[Cloudinary] Error: Cloudinary credentials missing in production environment.")
            raise ValueError("Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET or CLOUDINARY_URL) are missing in production.")
        else:
            name = filename or getattr(file_obj, 'name', 'image.png')
            logger.warning("[Cloudinary] Warning: Cloudinary credentials missing. Using local media fallback for development.")
            return f"http://localhost:8000/media/{folder}/{name}"

    try:
        options = {
            "folder": folder,
            "resource_type": "auto",
            "use_filename": True,
            "unique_filename": True,
        }
        
        # Determine public_id if filename is provided
        if filename:
            clean_id = os.path.splitext(filename)[0]
            options["public_id"] = clean_id

        upload_result = cloudinary.uploader.upload(file_obj, **options)
        secure_url = upload_result.get("secure_url") or upload_result.get("url")
        return secure_url
    except Exception as e:
        logger.error(f"[Cloudinary Upload Error]: {e}")
        raise e
