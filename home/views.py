from django.shortcuts import render
from django.views import View


# Create your views here.

class IndexView(View):
    """
    首页广告
    """

    @staticmethod
    def get(request):
        """
        提供首页广告页面
        :param request: 请求对象
        :return: 返回视图
        """
        return render(request, 'index.html')
