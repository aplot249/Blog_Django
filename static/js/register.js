const vm = new Vue({
    el: '#app',
    // 修改Vue变量的读取语法，避免和django模板语法冲突
    delimiters: ['[[', ']]'],
    data: {
        host,
        show_menu: false,
        mobile: '',
        mobile_error: false,
        mobile_error_message: '手机号错误',
        password: '',
        password_error: false,
        password_error_message: '密码错误',
        password2: '',
        password2_error: false,
        password2_error_message: '密码不一致',
        uuid: '',
        image_code: '',
        image_code_error: false,
        image_code_error_message: '图片验证码错误',
        sms_code: '',
        sms_code_error: false,
        sms_code_error_message: '短信验证码错误',
        sms_code_message: '点击获取验证码',
        sending_flag: false,
        image_code_url: ''
    },
    mounted() {
        this.generate_image_code()
    },
    methods: {
        //显示下拉菜单
        show_menu_click: function () {
            this.show_menu = !this.show_menu;
        },
        generateUUID: function () {
            let d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        },
        // 生成一个图片验证码的编号，并设置页面中图片验证码img标签的src属性
        generate_image_code: function () {
            // 生成一个编号 : 严格一点的使用uuid保证编号唯一， 不是很严谨的情况下，也可以使用时间戳
            this.uuid = this.generateUUID();
            // 设置页面中图片验证码img标签的src属性
            this.image_code_url = this.host + "/imagecode/?uuid=" + this.uuid;
        },
        //检查手机号
        check_mobile: function () {
            const re = /^1[3-9]\d{9}$/;
            this.mobile_error = !re.test(this.mobile);
        },
        //检查密码
        check_password: function () {
            const re = /^[0-9A-Za-z]{8,20}$/;
            this.password_error = !re.test(this.password);

        },
        //检查确认密码
        check_password2: function () {
            this.password2_error = this.password !== this.password2;
        },
        //检查验证码
        check_image_code: function () {
            this.image_code_error = !this.image_code;
        },
        //检查短信验证码
        check_sms_code: function () {
            this.sms_code_error = !this.sms_code;
        },
        //发送短信验证码
        send_sms_code: function () {
            if (this.sending_flag === true) {
                return;
            }
            this.sending_flag = true;

            // 校验参数，保证输入框有数据填写
            this.check_mobile();
            this.check_image_code();

            if (this.mobile_error === true || this.image_code_error === true) {
                this.sending_flag = false;
                return;
            }

            // 向后端接口发送请求，让后端发送短信验证码
            const url = this.host + '/smscode/?mobile=' + this.mobile + '&image_code=' + this.image_code + '&uuid=' + this.uuid;
            axios.get(url, {
                responseType: 'json'
            })
                .then(response => {
                    // 表示后端发送短信成功
                    if (response.data.code === '0') {
                        // 倒计时60秒，60秒后允许用户再次点击发送短信验证码的按钮
                        let num = 60;
                        // 设置一个计时器
                        const t = setInterval(() => {
                            if (num === 1) {
                                // 如果计时器到最后, 清除计时器对象
                                clearInterval(t);
                                // 将点击获取验证码的按钮展示的文本回复成原始文本
                                this.sms_code_message = '获取短信验证码';
                                // 将点击按钮的onclick事件函数恢复回去
                                this.sending_flag = false;
                            } else {
                                num -= 1;
                                // 展示倒计时信息
                                this.sms_code_message = num + '秒';
                            }
                        }, 1000, 60);
                    } else {
                        if (response.data.code === '4001') {
                            //图片验证码错误
                            this.image_code_error = true;
                        }
                        this.sms_code_error = true;
                        this.generate_image_code();
                        this.sending_flag = false;
                    }
                })
                .catch(error => {
                    console.log(error.response);
                    this.sending_flag = false;
                })
        },
        //提交
        on_submit: function () {
            this.check_mobile();
            this.check_password();
            this.check_password2();
            this.check_sms_code();

            if (this.mobile_error === true || this.password_error === true || this.password2_error === true
                || this.image_code_error === true || this.sms_code_error === true) {
                // 不满足注册条件：禁用表单
                window.event.returnValue = false;
            }
        }
    }
});
