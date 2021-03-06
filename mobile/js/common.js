
var Commons = {
    ajaxData : function(name, params, type, bindObj, success_cb, fail_cb,loadingSelectors){
        var _this = this;
        var url = _this.getOrigin() + _this.URLFromName[name];
//        var url = 'http://local.clickgarage.in/' + _this.URLFromName[name];
        var callType = "GET";
        if(type == "POST" || type == "GET"){
            callType = type
        }

        if(params){
            if(params instanceof Object){
            params['loc'] = 'mobile'
            }
        }else{
            params = {'loc':'mobile'}
        }
        if(name){
            if(loadingSelectors && loadingSelectors.open){
                $(loadingSelectors.open).click();
            }
    

            $.ajax({
                url:url,
                data:params,
                dataType:"json",
                type:callType

            }).always(function(res){
                if(loadingSelectors && loadingSelectors.close){
                    $(loadingSelectors.close).click();
                }

//                    console.log(res)
                    if(res.status){
                        bind(success_cb, bindObj, [res.result])
                    }
                });
        }
    },
    URLFromName : {
        'fetch_all_cars':'/api/fetch_all_cars/',
        //'fetch_car_servicing':'/api/fetch_car_servicing/',
        //'fetch_servicing_details':'/api/fetch_servicing_details/',
        'fetch_car_servicing':'/api/fetch_car_servicing_new/',
        'fetch_servicing_details':'/api/fetch_servicing_details_new/',
        'fetch_car_cleaning':'/api/fetch_car_cleaning/',
        'fetch_cleaning_details':'/api/fetch_cleaning_details/',
        'fetch_car_windshield':'/api/fetch_car_windshield/',
        'fetch_windshield_details':'/api/fetch_windshield_details/',
        'fetch_car_vas':'/api/fetch_car_vas/',
        'fetch_vas_details':'/api/fetch_vas_details/',
        'fetch_car_carcare':'/api/fetch_car_vas/',
        'fetch_carcare_details':'/api/fetch_vas_details/',
        'fetch_car_cleanings':'/api/fetch_all_cleaningcatservices/',
        'fetch_car_tyres':'/api/fetch_all_cleaningcatservices/',
        'add_to_cart':'/api/add_to_cart/',
        'place_order':'/api/place_order/',
        'place_emergency_order':'/api/place_emergency_order/',
        'fetch_car_booking':'/api/fetch_car_booking/',
        'fetch_car_cancelled':'/api/fetch_car_cancelled/',
        'cancel_booking':'/api/cancel_booking/',
        'fetch_car_list':'/api/fetch_car_list/',
        'fetch_car_autocomplete':'/api/fetch_car_autocomplete/',
        'add_guest_transaction':'/api/add_guest_transaction/',
        'logout':'/logout/',
        'fetch_user_login':'/api/fetch_user_login/',
        'send_otp':'/api/send_otp/',
        'create_otp_user':'/api/create_otp_user/',
        'service_selected':'/api/service_selected/',
        'apply_coupon':'/api/apply_coupon/'
        //'fetch_Servicing_details':'/api/fetch_servicing_details/',
        //'fetch_Cleaning_details':'/api/fetch_cleaning_details/',
    },
    getOrigin: function(){
        var origin = window.location.origin;
        if(origin[origin.length-1] == '/'){
            origin = origin.slice(0,-1);
        }
        return origin;
    },
    showRegisterForm : function(){
        $('.loginBox').fadeOut('fast',function(){
            $('.registerBox').fadeIn('fast');
            $('.login-footer').fadeOut('fast',function(){
                $('.register-footer').fadeIn('fast');
            });
            $('.modal-title').html('Register with');
        });
        $('.error').removeClass('alert alert-danger').html('');

    },
    showLoginForm : function(){
        $('#loginModal .registerBox').fadeOut('fast',function(){
            $('.loginBox').fadeIn('fast');
            $('.register-footer').fadeOut('fast',function(){
                $('.login-footer').fadeIn('fast');
            });

            $('.modal-title').html('Login with');
        });
        $('.error').removeClass('alert alert-danger').html('');

    },
    openLoginModal : function(){
        Commons.showLoginForm();
        setTimeout(function(){
            $('#loginModal').modal('show');
        }, 230);

    },
    openRegisterModal : function(){
        Commons.showRegisterForm();
        setTimeout(function(){
            $('#loginModal').modal('show');
        }, 230);

    },
    loginAjax : function(){
        /*   Remove this comments when moving to server*/
        $.post( "/login", function( data ) {
                if(data == 1){
                    window.location.replace("/home");
                } else {
                     shakeModal();
                }
            });

    /*   Simulate error message from the server   */
         Commons.shakeModal();

    },
    shakeModal : function(){
        $('#loginModal .modal-dialog').addClass('shake');
                 $('.error').addClass('alert alert-danger').html("Invalid email/password combination");
                 $('input[type="password"]').val('');
                 setTimeout( function(){
                    $('#loginModal .modal-dialog').removeClass('shake');
        }, 1000 );

    },
    eventHandlers : function(){
        $('body').on('click', function(e){
            var $target = $(e.target);
            if( !$target.closest('.logged-user-drpdwn').length && !$target.closest('#settings-drpdwn').length ){
            $('.logged-user-drpdwn').hide();
            }
        });
        $('#sign-up-in-home').on('click', function(e){
//            console.log($('.modal-container'))
            $('.login-modal-container').show().animate({
                'opacity':1
            },100);//.children().hide();
//            $('.login-modal-container').find('#loginModal').show();
//            alert('p')
            $('.login-modal-container').find('#loginModal').addClass('in');
        });
        $('#sign-up-in-dash').on('click', function(e){
            $('.login-modal-container').show().animate({
                'opacity':1
            },100);//.children().hide();
            $('.login-modal-container').find('#loginModal').addClass('in');
        });
        $('.login-modal-container').on('click', function(e){
            var $target = $(e.target);
            if(!$target.closest('.modal-dialog').length && $('#loginModal').hasClass('in')){
                $('#loginModal').removeClass('in');
                $(this).animate({
                    'opacity':0
                }, 300).fadeOut(10);

            }
        });
//        $('#loginModal')
    }
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

var logoMap = {
    '3M':'../static/img/dl-logo-3M.png',
    'AIS':'../static/img/dl-logo-ais.png',
    'Tee Car Care':'../static/img/dl-logo-Tee.png',
    'Exppress Car Wash':'../static/img/dl-logo-Exppress.png',
    'ClickGarage On-The-Go':'../static/img/dl-logo-OntheGo.png',
    'ClickGarage Doorstep':'../static/img/dl-logo-doorstep.png',
    'Authorized':'../static/img/brands/',
    'Authorized Bike':'../static/img/brands/Bike/',
    'Authorized Car':'../static/img/brands/Car/',
    'Bosch':'../static/img/dl-logo-Bosch.jpg',
    'ClickGarage Verified':'../static/img/dl-logo-cgverified.png',
    'Mahindra First Choice':'../static/img/dl-logo-MFC.jpg',
    'ClickGarage Workshop':'../static/img/dl-logo-cgverified.png',
    'Bosch Car Care':'../static/img/dl-logo-Bosch.jpg',
};

var Templates = {
    orderPage:{
        servicing:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "class":"vendor-div", "html":function(){return "<div> Select this Service </div>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"due-div fl", "html":function(){return "<span class='due-at-read'>Due at</span> <span class='odo-read'>"+ String(this.odometer).replace(/(.)(?=(\d{3})+$)/g,'$1,')+ ' km ' + (this.year == "" ? '': '/ ') + this.year+"</span>";}},
                        
                    {"tag":"div", "class":"service-details fix_servicedetails", "children":[  
                        {"tag":"div", "class":"checks-div", "html":function(){return 'Washing';}},
                        {"tag":"div", "class":"checks-div", "html":function(){return 'Regular Checks';}},        
                        {"tag":"div", "class":"parts-div", "html":function(){
                            var html = '';
                            if(this['parts_replaced'] && this['parts_replaced'].length){
                                $.each(this['parts_replaced'], function(i, part){
                                    html += '<span class="token-class">'+part+'</span>&nbsp;';
                                });
                                return html;
    //                            return "Regular Checks :" + this['parts_replaced'].join(', ');
                            }
                            else
                                return "None";}}
                            ]}
                    ]}
                ]},
            
                {"tag":"div", "class":"state-update none-i"}
            ]
        }],
        cleaning:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "class":"vendor-div", "html":function(){return "<div> Select this Service </div>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"due-div", "html":function(){return "<span class='clean-cat'>"+this.category +"</span>";}},
//                        {"tag":"div", "class":"price-div", "html":function(){return "Type : <span>"+this['paid_free']+"</span>";}}
                    ]}
                ]},
                {"tag":"div", "class":"state-update none-i"}
            ]
        }],
        dealers:[{
            "tag":"div","class":"dealer-list-item","data-id":"${id}", "data-name":"${vendor}", "children":[
                {"tag":"div","class":"td-dealer-info", "children":[
                    {"tag":"div", "class":"vendor-name","html":function(){
                         if($.trim(this.vendor) == 'Authorized'){
                                     return this.brand + ' Authorized';
                                }else{
                                    return this.vendor;
                                }
                    }},
                    {"tag":"div", "class":"dealer-logo-wrapper", "html":function(){
                        if(this.vendor){
                            if($.trim(this.vendor) == 'Authorized'){
                                if(this.car_bike=='Bike'){
                                     return '<img src="'+ logoMap['Authorized Bike'] + $.trim(this.brand)+'.jpg" alt="'+this.vendor+'" /><div class="aligner"></div>';
                                }else{
                                     return '<img src="'+ logoMap['Authorized Car'] + $.trim(this.brand)+'.jpg" alt="'+this.vendor+'" /><div class="aligner"></div>';
                                }

                            }else{
                                return '<img src="'+logoMap[$.trim(this.vendor)]+'" alt="'+this.vendor+'" /><div class="aligner"></div>';
                            }
                        }else{
                            return 'N/A'
                        }
                    }},
                ]},
                {"tag":"div","class":"td-service-info", "children":[
                    {"tag":"div", "class":"text","html":"Regular Servicing"},
                    {"tag":"div", "class":"sub-text","html":"(${odometer}km)"}
                ]},
                {"tag":"div","class":"col-item td-dealer-select", "children":[
                    // {"tag":"div", "class":"dealer-checkout", "html":"<a href='/checkout'>Checkout</a>"},

                    {"tag":"div", "html":"<a class='dealer-add-to-cart', href='/cart'>Add to Cart</a>"}
                ]},
                {"tag":"div","class":"td-price", "children":[
                    {"tag":"div", "class":"table-parts","html":function(){return "<table><tr><td>Parts</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+parseInt(this.parts_price)+"</td></tr><tr><td>Labour</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.labour_price))+"</td></tr><tr><td>Service Tax</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.labour_price*0.14))+"</td></tr><tr><td>Pick-Up Fee</td><td>:<strike><i style='padding-left:10px' class='fa fa-inr'></i>200</strike><i style='padding-left:10px' class='fa fa-inr'></i>"+ (this.car_bike == 'Car' ? '0': '0')+"</td></tr><tr id = 'total-row'><td>Total</td><td>:<i class='fa fa-inr' style='padding-left:10px'></i>"+(parseInt(this.parts_price)+parseInt(Math.ceil((this.labour_price)))+parseInt(Math.ceil((this.labour_price*0.14)))+parseInt((this.car_bike == 'Car' ? '0': '0')))+"</td></tr></table>";}}
                    ]},
                {"tag":"div","class":"col-item td-rating", "html":""}
            ]
        }],
        cleaning_old:{
            cleaning_group_head:[{
                "tag":"div","class":"service-group-head", "data-name":"${name}", "data-id":"${id}",  "children":[
                    {"tag":"div", "class":"dealer-logo-wrapper", "html":function(){
                        if(this.name){
                            return '<img src="'+logoMap[$.trim(this.name)]+'" alt="'+this.name+'" /><div class="aligner"></div>';
                        }else{
                            return 'N/A'
                        }
                    }},
                    {"tag":"div", "class":"dealer-number-label", "html":function(){ return this.list.length; }},
                    {"tag":"div", "class":"pointer right-triangle"},
                    {"tag":"div", "class":"select-border"}
//                    {"tag":"div", "class":"brand-div", "html":function(){return "Dealer : <span>"+this.name+"</span>";}},
//                    {"tag":"div", "class":"price-div", "html":function(){return "Number : <span>"+this.list.length+"</span>";}}
                ]
            }],
            cleaning_group_body:[{
                "tag":"div","class":"service-group-item wrapper detail-wrapper", "data-name":"${name}", "data-id":"${id}", "html":function(){
                        return json2html.transform(this.list, Templates.orderPage.cleaning.cleaning_item)
                }
            }],
            cleaning_item:[{
                "tag":"div", "class":"service-list-item", "data-id":"${id}", "children":[
                    {"tag":"div", "class":"header-wrapper", "children":[
                        {"tag":"div", "class":"", "html":function(){return this.category}}
                    ]},
                    {"tag":"div", "class":"state-update none-i"}
                ]
            }]
        },
        packages:[{
            "tag":"div","class":"dealer-list-item cleaning","data-id":"${id}", "data-name":"${vendor}", "children":[
                {"tag":"div","class":"td-dealer-info", "children":[
                    {"tag":"div", "class":"vendor-name","html":function(){
                         if($.trim(this.vendor) == 'Authorized'){
                                     return this.brand + ' Authorized';
                                }else{
                                    return this.vendor;
                                }}},
                    {"tag":"div", "class":"dealer-logo-wrapper", "html":function(){
                        if(this.vendor){
                            if($.trim(this.vendor) == 'Authorized'){
                                return '<img src="'+logoMap['Authorized']+ $.trim(this.brand)+'.jpg" alt="'+this.vendor+'" /><div class="aligner"></div>';
                            }else{
                                return '<img src="'+logoMap[$.trim(this.vendor)]+'" alt="'+this.vendor+'" /><div class="aligner"></div>';
                            }
                        }else{
                            return 'N/A'
                        }
                    }},

                ]},
                {"tag":"div","class":"td-service-info", "children":[
                    {"tag":"div", "class":"text","html":"${service}"},
                    {"tag":"div", "class":"sub-text","html":"(${category})"},
                    {"tag":"div", "class":"doorstep-div", "html":function(){
                        if(this.doorstep=="1"){return "<span class='doorstep'><i class='fa fa-home'></i>&nbspDoorstep Service</span>"
                        }else{
                            return ''
                        }}}
                ]},
                {"tag":"div","class":"col-item td-dealer-select", "children":[
                    // {"tag":"div", "class":"dealer-checkout", "html":"<a href='/checkout'>Checkout</a>"},
                    {"tag":"div", "html":"<a class='dealer-add-to-cart', href='/cart'>Add to Cart</a>"}
                ]},
                {"tag":"div","class":"col-item td-price", "children":[
    {"tag":"div", "class":"table-parts","html":function(){return "<table><tr><td>Service Price</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+this.total_price+"</td></tr>"+ (this.doorstep == '0' ? "<tr><td>Pick-Up Fee</td><td>:<strike><i style='padding-left:10px' class='fa fa-inr'></i>200</strike><i style='padding-left:10px' class='fa fa-inr'></i>0</td></tr>" : '')+"<tr><td>Total</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+this.total_price+"</td></tr></table>";}}                ]},
                {"tag":"div","class":"col-item td-rating", "html":""}
            ]
        }],
        parts:[{"tag":"span", "class":"token-class", "html":function(){return this}}]

    },
    bookingPage:{
        booking:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "id":"cancel-booking",  "tran_id":"${tran_id}", "class":"vendor-div", "html":function(){return "<div> Cancel Booking </div>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"booking id booking_id", "html":function(){return '#'+(this.booking_id);}},
                        {"tag":"div", "class":"booking car booking_car", "html":function(){return (this.cust_carname);}},
                        {"tag":"div", "class":"booking date booking_date", "html":function(){return (this.date_booking) + ' ('+this.time_booking+')';}},
                        {"tag":"div", "class":"booking list booking_list", "html":function(){
                            var s = '<ul class="service-components">'
                            $.each(this.service_items,function(i,elem){
                                if(elem.service == 'servicing'){
                                s += '<li class="indiv_booking">'+elem.served_data.dealer_cat+'  <i class="fa fa-caret-right"></i>  '+ elem.served_data.odometer+'km (Regular Sevicing) </li>'
                                }else{
                                s += '<li class="indiv_booking">'+elem.served_data.vendor +'  <i class="fa fa-caret-right"></i>  '+ elem.served_data.service+' ( '+elem.served_data.category+' ) </li>'
                                }
                            })
                            s += '</ul>'
                            return s
                        }
                        },    
                        
                        ]},
    

                ]},
        
            ]
        }],
        cancelled:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    
                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"booking id booking_id", "html":function(){return '#'+(this.booking_id);}},
                        {"tag":"div", "class":"booking car booking_car", "html":function(){return (this.cust_carname);}},
                        {"tag":"div", "class":"booking date booking_date", "html":function(){return (this.date_booking) + ' ('+this.time_booking+')';}},
                        {"tag":"div", "class":"booking list booking_list", "html":function(){
                            var s = '<ul class="service-components">'
                            $.each(this.service_items,function(i,elem){
                             if(elem.service == 'servicing'){
                                s += '<li class="indiv_booking">'+elem.served_data.dealer_cat+'  <i class="fa fa-caret-right"></i>  '+ elem.served_data.odometer+'km (Regular Sevicing) </li>'
                                }else{
                                s += '<li class="indiv_booking">'+elem.served_data.vendor +'  <i class="fa fa-caret-right"></i>  '+ elem.served_data.service+' ( '+elem.served_data.category+' ) </li>'
                                }
                            })
                            s += '</ul>'
                            return s
                        }
                        },    
                        
                        ]},
    

                ]},
        
            ]
        }]},
    mobile:{
        servicing:{

        }
    }

};

if (typeof String.prototype.toTitleCase != 'function') {
    String.prototype.toTitleCase = function (){
        return (this[0].toUpperCase() + this.slice(1));
    };
}

/*
*   1   -   userid
*   2   -   name
*   3   -
*   4   -
*   5   -
*
total transaction data required -
    booking_id         = models.IntegerField()
    trans_timestamp    = models.CharField(max_length=200)
    cust_name          = models.CharField(max_length=200)
    cust_brand         = models.CharField(max_length=200)
    cust_carname       = models.CharField(max_length=200)
    cust_number        = models.CharField(max_length=200)
    cust_email         = models.CharField(max_length=200)
    cust_pickup_add    = models.CharField(max_length=200)
    cust_drop_add      = models.CharField(max_length=200)
    booking_vendor     = models.CharField(max_length=200)
    booking_cat        = models.CharField(max_length=200)
    booking_type       = models.CharField(max_length=200)
    price_labour       = models.CharField(max_length=200)
    price_parts        = models.CharField(max_length=200)
    price_total        = models.CharField(max_length=200)
    date_booking       = models.CharField(max_length=200)
    time_booking       = models.CharField(max_length=200)
    amount_paid        = models.BooleanField()
    status             = models.CharField(max_length=200)
    comments           = models.CharField(max_length=300)

*
* */

var local = {
    save:function(key, value){
        var stringKey = 'clgacart';
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
        var stringKey = 'clgacart';
        if(key){
            stringKey = key;
        }
        document.cookie = stringKey+'=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        document.cookie = stringKey+'=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    },
    clearAll:function(){

    }
};

var formCheck = {
    addressForm : function(container){

        var valid = function(str){
            if(!str || !(str.length)){
                return false
            }
            return true;
        };
        var user_name = $(container).find('.user-name').val();
        var user_number = $(container).find('.user-number').val();
        var car_reg_number = $(container).find('.car-reg-no').val();

        var pick_addr = $(container).find('.pick-addr').val();
        var pick_pin = $(container).find('.pick-pin').val();
        var pick_lmark = $(container).find('.pick-lmark').val();

        var dropMatch = $(container).find('.pick-drop-toggle').is(':checked');

        var drop_addr = $(container).find('.drop-addr').val();
        var drop_pin = $(container).find('.drop-pin').val();
        var drop_lmark = $(container).find('.drop-lmark').val();

        if(!valid(user_name)){
            $(container).find('.user-name').addClass('error');
            return false
        }
        if(!valid(user_number)){
            $(container).find('.user-number').addClass('error');
            return false
        }else{
            if(isNaN(parseInt(user_number)) || user_number.length != 10){
                $(container).find('.user-number').addClass('error');
                return false
            }
        }


        if(!valid(pick_addr)){
            $(container).find('.pick-addr').addClass('error');
            return false
        }
        if(!valid(pick_pin)){
            $(container).find('.pick-pin').addClass('error');
            return false
        }else{
            console.log(pick_pin.length)
            if(isNaN(parseInt(pick_pin)) || pick_pin.length != 6){
                $(container).find('.pick-pin').addClass('error');
                return false
            }
        }
        if(!valid(car_reg_number)){
            $(container).find('.car-reg-no').addClass('error');
            return false
        }else{
            if(car_reg_number.length != 10){
                $(container).find('.car-reg-no').addClass('error');
                return false
            }
        }
        if(!valid(drop_addr)){
            $(container).find('.drop-addr').addClass('error');
            return false
        }
        if(!valid(drop_pin)){
            $(container).find('.drop-pin').addClass('error');
            return false
        }else{
//            console.log(pick_pin.length)
            if(isNaN(parseInt(drop_pin)) || drop_pin.length != 6){
                $(container).find('.drop-pin').addClass('error');
                return false
            }
        }
//        if(!valid(pick_lmark)){
//            $(container).find('.pick-lmark').addClass('error');
//            return false
//        }
        return true;
    },
    clearErrorEvent : function(e){
        if($(this).val() && $(this).val().length){
            $(this).removeClass('error');
        }
    },
    setSelectedAddress : function(){

    },
    getSelectedAddress : function(container){
        var user_name = $(container).find('.user-name').val();
        var user_number = $(container).find('.user-number').val();
        var car_reg_number = $(container).find('.car-reg-no').val();
        var pick_addr = $(container).find('.pick-addr').val();
        var pick_pin = $(container).find('.pick-pin').val();
        var pick_lmark = $(container).find('.pick-lmark').val();
        var pick_city = $(container).find('.pick-city').val();
        var pick_time = $(container).find('.pick-up-time').val();
        var pick_date = $(container).find('.pick-up-date').val();
        var drop_addr = $(container).find('.drop-addr').val();
        var drop_pin = $(container).find('.drop-pin').val();
        var drop_lmark = $(container).find('.drop-lmark').val();
        var drop_city = $(container).find('.drop-city').val();
        var obj = {
            name : user_name,
            number : user_number,
            reg_no : car_reg_number,
            pick:{
                street : pick_addr,
                pincode : pick_pin,
                landmark : pick_lmark,
                city : pick_city,
                time : pick_time,
                date : pick_date
            },
            drop:{
                street : drop_addr,
                pincode : drop_pin,
                landmark : drop_lmark,
                city : drop_city
            }
        };
        return obj;
    }


};