from django.db import models
from django.utils import timezone


class ArticleCategory(models.Model):
    """
    文章分类实体类
    """
    # 栏目标题
    title = models.CharField(max_length=100, blank=True)
    # 创建时间
    created = models.DateTimeField(default=timezone.now)

    def __str__(self):
        """
        重写该方法: 页面中才可以显示
        :return: 返回标题即可
        """
        return self.title

    class Meta:
        db_table = 'tb_category'
        verbose_name = '类别管理'
        verbose_name_plural = verbose_name
