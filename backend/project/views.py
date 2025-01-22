from django.http import JsonResponse
from datetime import datetime
import pytz

def index(request):
    # Set the timezone to your local timezone
    local_tz = pytz.timezone('America/New_York')  # Replace with your timezone
    current_time = datetime.now(local_tz).strftime("%I:%M %p")
    current_date = datetime.now(local_tz).strftime("%A %B %d, %Y")

    data = {
        "time": current_time,
        "date": current_date
    }

    return JsonResponse(data)