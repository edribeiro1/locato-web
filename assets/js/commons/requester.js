const REQUESTER = {
    gerarUrl: function (url) {
        // var urlApi = 'http://[::1]/api-locato/';
        var urlApi = 'http://ec2-18-231-42-88.sa-east-1.compute.amazonaws.com/locato-api/';
        return urlApi + url + '/';
    },
    getToken: function() {
        let dataToken = localStorage.getItem('token');
        try {
            dataToken = JSON.parse(dataToken);
        } catch (e) {
            window.location.href = baseUrl + 'login';
        }
        return dataToken.access_token;
    },
    enviar: function (url, data, config) {

        let dataToken = localStorage.getItem('token');
        try {
            dataToken = JSON.parse(dataToken);
        } catch (e) {
            window.location.href = baseUrl + 'login';
        }

        let configPadrao = {
            url: url,
            type: "POST",
            data: data,
            processData: true,
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            headers: { 'Authorization': 'Bearer ' + dataToken.access_token },
            error: xhr => {
                if (xhr.status == 401) {
                    REQUESTER.refreshToken(dataToken.refresh_token, () => {
                        REQUESTER.enviar(url, data, config);
                    });
                }
                else {
                    if (typeof config.fnerror == 'function') {
                        config.fnerror(xhr);
                    }
                    else {
                        REQUESTER.izitoast({
                            type: 'error',
                            title: 'Erro',
                            message: xhr.hasOwnProperty('responseJSON') && xhr.responseJSON.hasOwnProperty('message') && xhr.responseJSON.message ? xhr.responseJSON.message : 'Erro ao executar a ação, atualize a página e tente novamente!'
                        });
                        Ladda.stopAll();
                    }
                }
            }
        };

        $.extend(configPadrao, config);
        $.ajax(configPadrao);
    },
    refreshToken: function (refreshToken, cb) {

        let data = {
            grant_type: 'refresh_token',
            client_id: 'web',
            client_secret: '6648ee7559e05d1549afb7d1694b6d822dd2a831',
            refresh_token: refreshToken
        };

        $.ajax({
            url: REQUESTER.gerarUrl('token/refresh'),
            type: "POST",
            data: data,
            processData: true,
            contentType: "application/x-www-form-urlencoded",
            dataType: 'json',
            success: function (data) {
                localStorage.setItem('token', JSON.stringify(data));
                cb();
            },
            error: function (xhr) {
                window.location.href = 'login';
            }
        });
    },
    izitoast: function (config) {
        let configIzitoast = $.extend({
            class: 'iziToastPadrao',
            position: 'topCenter',
            close: true,
            timeout: 3000,
            buttons: [],
        }, config);

        if ($.type(configIzitoast.class) == "string") {
            if ($("." + configIzitoast.class).length > 0) {
                iziToast.hide({
                    transitionOut: 'fadeOut'
                }, $("." + configIzitoast.class)[0]);
            }
        }

        iziToast[configIzitoast.type](configIzitoast);

    }
}