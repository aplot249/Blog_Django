"""
在该类中配置 MySQL 的数据库:
    因为这是初始化类,项目一加载就会执行该类,此时我们将连接数据库;
"""
import pymysql

version_info = (1, 3, 12, "final", 0)
pymysql.install_as_MySQLdb()
