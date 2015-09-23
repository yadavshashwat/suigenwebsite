/**
 * Created with PyCharm.
 * User: vociferous
 * Date: 03/08/15
 * Time: 10:06 PM
 * To change this template use File | Settings | File Templates.
 */


var Commons = {
    ajaxData : function(name, params, type, bindObj, success_cb, fail_cb){
        var _this = this;
        var url = _this.getOrigin() + _this.URLFromName[name];
        var callType = "GET";
        if(type == "POST" || type == "GET"){
            callType = type
        }
        console.log(name)
        if(name){
            $.ajax({
                url:url,
                data:params,
                dataType:"json",
                type:callType

            }).always(function(res){
                    if(res.status){
                        bind(success_cb, bindObj, [res.result])
                    }
                });
        }
    },
    URLFromName : {
        'fetch_all_cars':'/api/fetch_all_cars/',
        'fetch_car_servicing':'/api/fetch_car_servicing/',
        'fetch_servicing_details':'/api/fetch_servicing_details/',
        'fetch_car_cleaning':'/api/fetch_car_cleaning/',
        'fetch_cleaning_details':'/api/fetch_cleaning_details/',
        'fetch_car_vas':'/api/fetch_car_vas/',
        'fetch_vas_details':'/api/fetch_vas_details/',
        'fetch_car_cleanings':'/api/fetch_all_cleaningcatservices/',
        'fetch_car_tyres':'/api/fetch_all_cleaningcatservices/',
        'add_to_cart':'/api/add_to_cart/'
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
    'Tee Car Care':'../static/img/dl-logo-Tee.png',
    'Exppress Car Wash':'../static/img/dl-logo-Exppress.png',
    'ClickGarage On-The-Go':'',
    'Authorized':'../static/img/brands/',
    'Bosch':'../static/img/dl-logo-Bosch.jpg',
    'ClickGarage Workshop':'',
    'Mahindra First Choice':'../static/img/dl-logo-MFC.jpg'
};

var Templates = {
    orderPage:{
        servicing:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "class":"detail-div", "html":function(){return "<div> Details </div><i class='fa fa-ellipsis-h'></i>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"due-div fl", "html":function(){return "due at : <span>"+this.odometer + ' / '+ this.year+"</span>";}},
                        {"tag":"div", "class":"price-div", "html":function(){return "Type : <span>"+this['paid_free']+"</span>";}}
                    ]}
                ]},
                {"tag":"div", "class":"bot-row", "children":[
                    {"tag":"div", "class":"row", "children":[
                         {"tag":"div", "class":"fr", "html":function(){
                                return 'Cleaning <i class="fa fa-check"></i>';
                         }},
                         {"tag":"div", "class":"fr", "html":function(){
                             if(this['regular_checks'] && this['regular_checks'].length){
                                return 'Regular Checks <i class="fa fa-check"></i>';
                             }else{
                                 return '<span class="disabled">Regular Checks</span>';
                             }
                         }},
//                         {"tag":"div", "class":"carname-div", "html":function(){return this['car_name']+" Servicing"; }},
                    ]},
                    {"tag":"div", "class":"row", "children":[
                        {"tag":"div", "class":"parts-label fl", "html":function(){
                            return "Parts Replaced : ";
                        }},
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
                                return "None";
                        }}

                    ]}

                ]},
                {"tag":"div", "class":"state-update none-i"}
            ]
        }],
        cleaning:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "class":"detail-div", "html":function(){return "<div> Details </div><i class='fa fa-ellipsis-h'></i>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"due-div", "html":function(){return "Cleaning Type : <span>"+this.category +"</span>";}},
//                        {"tag":"div", "class":"price-div", "html":function(){return "Type : <span>"+this['paid_free']+"</span>";}}
                    ]}
                ]},
                {"tag":"div", "class":"state-update none-i"}
            ]
        }],
        dealers:[{
            "tag":"div","class":"dealer-list-item","data-id":"${id}", "data-name":"${vendor}", "children":[
                {"tag":"div","class":"td-dealer-info", "children":[
                    {"tag":"div", "class":"none-i","html":"${vendor}"},
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
                    {"tag":"div", "class":"text","html":"Regular Servicing"},
                    {"tag":"div", "class":"sub-text","html":"(${odometer}km)"}
                ]},
                {"tag":"div","class":"col-item td-dealer-select", "children":[
                    {"tag":"div", "class":"dealer-checkout", "html":"Checkout"},
                    {"tag":"div", "class":"dealer-add-to-cart", "html":"Add to Cart"}
                ]},
                {"tag":"div","class":"col-item td-price", "children":[
                    {"tag":"div", "html":"${labour_price}"},
                    {"tag":"div", "html":"${parts_price}"}
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
            "tag":"div","class":"dealer-list-item","data-id":"${id}", "data-name":"${vendor}", "children":[
                {"tag":"div","class":"td-dealer-info", "children":[
                    {"tag":"div", "class":"none-i","html":"${vendor}"},
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
                    {"tag":"div", "class":"sub-text","html":"(${category})"}
                ]},
                {"tag":"div","class":"col-item td-dealer-select", "children":[
                    {"tag":"div", "class":"dealer-checkout", "html":"Checkout"},
                    {"tag":"div", "class":"dealer-add-to-cart", "html":"Add to Cart"}
                ]},
                {"tag":"div","class":"col-item td-price", "children":[
                    {"tag":"div", "html":"${price_labour}"},
                    {"tag":"div", "html":"${price_parts}"}
                ]},
                {"tag":"div","class":"col-item td-rating", "html":""}
            ]
        }]
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
        document.cookie = key+"="+stringVal;
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
        document.cookie = stringKey+'=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
    },
    clearAll:function(){

    }
};