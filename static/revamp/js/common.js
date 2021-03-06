

var Commons = {
    ajaxData : function(name, params, type, bindObj, success_cb, fail_cb, loadingSelector){
        var _this = this;
        var url = _this.getOrigin() + _this.URLFromName[name];
        var callType = "GET";
        if(type == "POST" || type == "GET"){
            callType = type
        }

        // console.log(name)
        if(name){
            if(loadingSelector){
                $(loadingSelector).show();
            }

            $.ajax({
                url:url,
                data:params,
                dataType:"json",
                type:callType

            }).always(function(res){
                    if(loadingSelector){
                        $(loadingSelector).hide();
                    }
                    // console.log(res)
                    if(res && res.status){
                        bind(success_cb, bindObj, [res.result])
                    }else{
                        bind(fail_cb, bindObj)
                    }
                });
        }
    },
    
    URLFromName : {
        'get_type_make':'/api/get_type_make/',
        'get_make_model':'/api/get_make_model/',
        'get_all_models':'/api/get_all_models/',
        'get_jobs_vehicle':'/api/get_jobs_vehicle/',
        'add_job_cart':'/api/add_job_cart/',
        'send_otp_new':'/api/send_otp_new/',
        'send_otp_booking':'/api/send_otp_booking/',
        'send_booking':'/api/send_booking/',
        'get_location':'/api/get_location/',
        'post_lead':'/api/post_lead/',
        'post_message':'/api/post_message/',
        'verify_otp_password_cookie':'/api/verify_otp_password_cookie/',
        'set_password_otp':'/api/set_password_otp/',
        'sign_up_otp':'/api/sign_up_otp/',
        'logout_view':'/api/logout_view/',
        'view_all_bookings':'/api/view_all_bookings/',
        'fetch_all_users':'/api/fetch_all_users/',
        'update_user':'/api/update_user/',
        'update_booking':'/api/update_booking/',
        'update_estimate':'/api/update_estimate/',
        'update_agent':'/api/update_agent/',
        'change_status':'/api/change_status/',
        'add_modify_coupon':'/api/add_modify_coupon/',
        'view_all_coupons':'/api/view_all_coupons/',
        'check_coupon':'/api/check_coupon/',
        'send_lead':'/api/send_lead/',
        'generate_bill':'/api/generate_bill/',
        'add_modify_subscription':'/api/add_modify_subscription/',
        'view_all_subscription':'/api/view_all_subscription/',
        'send_sms_campaign':'/api/send_sms_campaign/',
        'send_feedback':'/api/send_feedback/',
        'get_all_feedback':'/api/get_all_feedback/',
        'analyse_bookings':'/api/analyse_bookings/',
        'update_delete_expense':'/api/update_delete_expense/',
        'view_all_expense':'/api/view_all_expense/',
        'view_all_bills':'/api/view_all_bills/',
        'get_all_taxes':'/api/get_all_taxes/',
        'download_pdf':'/api/download_pdf/',
        'update_bill':'/api/update_bill/',
        'send_bill':'/api/send_bill/',
        'add_delete_payment':'/api/add_delete_payment/',
        'settle_freeze_booking':'/api/settle_freeze_booking/',
        'send_sms_customer':'/api/send_sms_customer/',
        'send_booking_bill_estimate':'/api/send_booking_bill_estimate/',
        'add_delete_payment_bill':'/api/add_delete_payment_bill/',
        'call_customer':'/api/call_customer/',
        'generate_send_report':'/api/generate_send_report/',
        'get_parts_vehicle':'/api/get_parts_vehicle/',
        'view_all_campaigns':'/api/view_all_campaigns/',
        'add_delete_campaign':'/api/add_delete_campaign/',
        'parts_inquiry': '/api/parts_inquiry/'


    },

    getOrigin: function(){
        var origin = window.location.origin;
        if(origin[origin.length-1] == '/'){
            origin = origin.slice(0,-1);
        }
        return origin;
    },



};

function bind(f, obj, args)
{   //console.log('Bind-',obj, args);
    if (f){
        if(f instanceof Function){
            return f.apply(obj, args);
        }else{
            for(var fi=0;fi<f.length;fi++)
            {
                f[fi].apply(obj, args);
            }
        }
    }else
        console.log('Empty callback');
}

var local = {
    save:function(key, value){
        var stringKey = 'cgcart';
        if(key){
            stringKey = key;
        }
        var stringVal = value;
        if(value instanceof Object){
            stringVal = JSON.stringify(value);
        }
        var dc_old = document.cookie;
        document.cookie = key+"="+stringVal+"; path=/";
    },
    load:function(){
        var dc_str = document.cookie;
        var dc_arr = dc_str.split(';');
        var dict = {};
        $.each(dc_arr, function(idx, val){
            dict[val.split('=')[0].trim()] = val.split('=')[1]
        });
        return dict;
    },
    clearKey:function(key){
        var stringKey = 'cgcart';
        if(key){
            stringKey = key;
        }
        document.cookie = stringKey+'=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie = stringKey+'=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    },
    clearAll:function(){
    }
};




