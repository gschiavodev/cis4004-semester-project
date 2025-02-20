from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse

@ensure_csrf_cookie
def csrf_token(request):
    return HttpResponse(status=204)