

var Commons = {
    ajaxData : function(name, params, type, bindObj, success_cb, fail_cb, loadingSelector){
        var _this = this;
        var url = _this.getOrigin() + _this.URLFromName[name];
        var callType = "GET";
        if(type == "POST" || type == "GET"){
            callType = type
        }
        console.log(name)

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
                    console.log(res)
                    if(res && res.status){
                        bind(success_cb, bindObj, [res.result])
                    }else{
                        bind(fail_cb, bindObj)
                    }
                });
        }
    },
    URLFromName : {
        'fetch_all_cars':'/api/fetch_all_cars/',
        'fetch_car_servicing_old':'/api/fetch_car_servicing/',
        //'fetch_servicing_details':'/api/fetch_servicing_details/',

        'fetch_car_servicing':'/api/fetch_car_servicing_new/',
        'fetch_servicing_details':'/api/fetch_servicing_details_new/',

        'fetch_car_cleaning':'/api/fetch_car_cleaning/',
        'fetch_car_windshield':'/api/fetch_car_windshield/',
        'fetch_windshield_details':'/api/fetch_windshield_details/',
        'fetch_cleaning_details':'/api/fetch_cleaning_details/',
        'fetch_car_vas':'/api/fetch_car_vas/',
        'fetch_vas_details':'/api/fetch_vas_details/',
        'fetch_car_cleanings':'/api/fetch_all_cleaningcatservices/',
        'fetch_car_tyres':'/api/fetch_all_cleaningcatservices/',
        'add_to_cart':'/api/add_to_cart/',
        'place_order':'/api/place_order/',
        'add_guest_transaction':'/api/add_guest_transaction/',
        'place_emergency_order':'/api/place_emergency_order/',
        'fetch_car_booking':'/api/fetch_car_booking/',
        'fetch_car_cancelled':'/api/fetch_car_cancelled/',
        'fetch_car_complete':'/api/fetch_car_complete/',
        'cancel_booking':'/api/cancel_booking/',
        'order_complete':'/api/order_complete/',
        'fetch_all_booking':'/api/fetch_all_booking/',
        'fetch_additional_details':'/api/fetch_additional_details/',
        'fetch_car_list':'/api/fetch_car_list/',
        'apply_coupon':'/api/apply_coupon/',
        'fetch_car_list':'/api/fetch_car_list/',
        'send_contact':'/api/send_contact/',
        'send_otp':'/api/send_otp/',
        'add_coupon':'/api/add_coupon/',
        'create_otp_user':'/api/create_otp_user/'
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
    sendOTp : function(){

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
            var _this = this;
        console.log('here')
        $('#contact-form').on('submit', function(){
                 var name =  $('#id_name').val();

                 var phone =  $('#id_phone').val();

                 var message =  $('#id_message').val();


                //elem.addClass('sent')
                //var tran_id = elem.attr('tran_id')
                //var classy = 'Booking'
                $('#id_name,#id_phone,#id_message').val('');
            $('#contact-form').find('.submit-row').prepend($('<div class="fl cnfrm-msg">e-Mail sent</div>'));
            setTimeout(function(){
                $('#contact-form').find('.submit-row .cnfrm-msg').fadeOut( "slow", function() {
                     // Animation complete.
                    $(this).remove();
              });
            }, 3000);
                Commons.ajaxData('send_contact', {name:name, phone:phone,message:message},"get",_this, eval("_this.afterSendContact"))
            return false;
        });
        $('.solid-header').find('.logo-click').on('click', function(e){
           var host = window.location.host;
            window.location = "http://"+host+'/?source=logo'
        });
        $('#settings-drpdwn').off().on('click', function(e){
            $(this).parent().find('.logged-user-drpdwn').toggle();
        });
        $('body').on('click', function(e){
            var $target = $(e.target);
            if( !$target.closest('.logged-user-drpdwn').length && !$target.closest('#settings-drpdwn').length ){
                $('.logged-user-drpdwn').hide();
            }
            if( !$target.closest('.description.tooltip-wrapper').length && !$target.closest('.info-icon').length){
                $('.description.tooltip-wrapper:visible').hide();
            }
        });
        $('body').on('click', '.modal-container .modal-overlay', function(e){
            var $target = $(e.target);
            if(!$target.closest('.modal-content').length && !$target.closest('.persist').length){
                $(this).closest('.modal-container').remove();
            }
        });
        $('body').on('click', '.modal-container .close-btn', function(e){
            $(this).closest('.modal-container').remove();
        });
        $('body').on('click', '.modal-container .otp-btn', function(e){

            var numb = $(this).closest('.loginBox').find('input#phone').val();
            var checkThis = false;
            if(numb && numb.length == 10){
                var intNum = parseInt(numb);
                if(!isNaN(intNum)){
                    checkThis = true;
                }
            }
            if(checkThis){
                $(this).closest('.loginBox').find('.error-msg').hide().text('');
                $(this).closest('.loginBox').find('input#phone').attr('disabled',true);
                Commons.ajaxData('send_otp', {phone:numb},"get",Commons,function(data){
                    $('#loginModal').find('.login-btn').show();
                    $('#loginModal').find('.otp-btn').hide();
                    $('#loginModal').find('#otp').show();
                    if(data.new_user){
                        $('#loginModal').find('#name').attr("placeholder","Name").val('').show();
                    }else if(data.username){
                        $('#loginModal').find('#name').attr("placeholder",data.username).val(data.username).show();
                    }else{
                        $('#loginModal').find('#name').attr("placeholder","Name").val('').show();
                    }
                })
            }else{
                Commons.shakeModal()
                $(this).closest('.loginBox').find('.error-msg').show().text('Invalid Number');
            }
        });
        $('body').on('click', '.modal-container .otp-login', function(e){
            var numb = $(this).closest('.loginBox').find('input#phone').val();
            var name = $(this).closest('.loginBox').find('input#name').val();
            var otp = $(this).closest('.loginBox').find('input#otp').val();
            if(otp && String(otp).length == 6){
                 $(this).closest('.loginBox').find('.error-msg').hide().text('');
                Commons.ajaxData('create_otp_user', {phone:numb,otp:otp,name:name},"get",Commons,function(data){
                    if(data.auth){
                        if(window.location.pathname.indexOf('loginPage')>=0){
                            window.location.pathname = '/order/';
                        }else{
                            window.location.reload();
                        }
                    }else if(data.msg){
                        Commons.shakeModal()

                        $('.login-modal-container').find('.error-msg').show().text(data.msg);
                    }else{
                        Commons.shakeModal()

                        $('.login-modal-container').find('.error-msg').show().text('Error loggin in.');
                    }
                });
            }else{
                Commons.shakeModal()
                $(this).closest('.loginBox').find('.error-msg').show().text('Invalid OTP');
            }

        });
        $('body').on('click', '.admin-popup', function(e){
            if(!$(e.target).closest('.white-area').length){
                $(this).closest('.admin-popup').hide();
            }
        });
        $('.clean-inp-wrapper').off().on('focus', 'input.clean-inp-tbox', function(e){
            $(this).closest('.clean-inp-wrapper').addClass('input-focused');
        });
        $('.clean-inp-wrapper').on('focusout', 'input.clean-inp-tbox', function(e){
            if(!$(this).val() && !$(this).hasClass('perpetual')){
                $(this).closest('.clean-inp-wrapper').removeClass('input-focused');
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
    '3M':'/static/img/dl-logo-3M.png',
    'Tee Car Care':'/static/img/dl-logo-Tee.png',
    'Exppress Car Wash':'/static/img/dl-logo-Exppress.png',
    'ClickGarage On-The-Go':'/static/img/dl-logo-OntheGo.png',
    'ClickGarage Doorstep':'/static/img/dl-logo-doorstep.png',
    'Authorized':'/static/img/brands/',
    'Authorized Bike':'/static/img/brands/Bike/',
    'Authorized Car':'/static/img/brands/Car/',
    'Bosch':'/static/img/dl-logo-Bosch.jpg',
    'ClickGarage Verified':'/static/img/dl-logo-cgverified.png',
    'Mahindra First Choice':'/static/img/dl-logo-MFC.jpg',
    'ClickGarage Workshop':'/static/img/dl-logo-cgverified.png',
    'Bosch Car Care':'/static/img/dl-logo-Bosch.jpg',
    'AIS':'/static/img/dl-logo-ais.png',
    '--':'/static/img/dl-logo-cgverified.png',
};

var Templates = {
    orderPage:{
        servicing_old:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "class":"vendor-div", "html":function(){return "<div> Book Now </div>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"due-div fl", "html":function(){return "<span class='due-at-read'>Due at</span> <span class='odo-read'>"+ String(this.odometer).replace(/(.)(?=(\d{3})+$)/g,'$1,')+ ' km ' + (this.year == "" ? '': '/ ') + this.year+"</span>";}},
                        
                    {"tag":"div", "class":"service-details fix_servicedetails", "children":[  
                        //{"tag":"div", "class":"checks-div", "html":function(){return 'Washing';}},
                        //{"tag":"div", "class":"checks-div", "html":function(){return 'Regular Checks';}},
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
        servicing:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "class":"vendor-div", "html":function(){return "<div> Book Now </div>";}}
                    ]},
                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        //{"tag":"div", "class":"due-div fl", "html":function(){return "<span class='odo-read'>"+  (this.type_service == "Not Defined" ? 'I am not sure<br> <span class="due-at-read">I will go with minor servicing and <br> would  like post check-up recommendation</span>': this.type_service)+"</span>";}},
                        {"tag":"div", "class":"due-div fl", "html":function(){return "<span class='odo-read'>"+ this.type_service + '<br> <span class="due-at-read">' + this.service_desc + "</span></span>";}},


                    {"tag":"div", "class":"service-details fix_servicedetails", "children":[
                        {"tag":"div","class":"checks-wrapper", "html":function(){
                            if(this.car_bike == 'Bike'){
                                return  (this.type_service=='General Check Up' ? '' : '<div class="checks-div">Washing & Polishing</div>') + '<div class="checks-div">Parts Check &amp; Replacement</div>'
                            }else{
                                return '<div class="checks-div">Exterior Washing</div><div class="checks-div">Interior Vacuuming</div><div class="checks-div">Dashboard Polish</div><div class="checks-div">Parts Check &amp; Replacement</div>'
                            }
                        }},
                        {"tag":"div", "class":"parts-div", "html":function(){
                            var html = '';
                            html +='<span class="desc">Description</span>';
                            ////if(this['car_bike']=="Bike"){
                            ////    html += '<span class="token-class">Engine Oil</span>&nbsp;';
                            ////    html += '<span class="token-class">Oil Filter</span>&nbsp;';
                            ////    html += '<span class="token-class">Other Parts as required</span>&nbsp;';
                            ////    return html;
                            ////}
                            //else{
                                var properObj = {
                                    'Parts/ Fluids Replaced':[],
                                    'Fluids Top-up':[],
                                    'Filters Cleaned':[],
                                    'Checks Done':[]
                                };
                                if(this['part_dic'] && this['part_dic'].length){
                                    $.each(this.part_dic, function(i,part){
                                        if(!properObj[part.part_action]){
                                            properObj[part.part_action]=[];
                                        }
                                        properObj[part.part_action].push(part.part_name);
                                    });
                                }
                                $.each(properObj, function(action,list){
                                    if(list.length) {
                                        html += '<div class="action-wrapper"><span class="action-name">' + action + '</span><div class="action-list">';
                                        html += json2html.transform(list, Templates.orderPage.parts);
                                        html += '</div></div>';
                                    }
                                });
                                html += '<div class="show-hide"></div>';
                                return html;
                                /*
                                if(this['parts_replaced'] && this['parts_replaced'].length){
                                //$.each(this['parts_replaced'], function(i, part){
                                //    html += '<span class="token-class">'+part+'</span>&nbsp;';
                                //});
    //                            return "Regular Checks :" + this['parts_replaced'].join(', ');
                                }
                                else
                                    return "None";
                            */
                                }
                            },
                        {"tag":"span", "class":"info", "html":"Parts in healthy condition won't be replaced."}
                            ]}
                    ]}
                ]},

                {"tag":"div", "class":"state-update none-i"}
            ]
        }],
        parts:[{"tag":"span", "class":"token-class", "html":function(){return this}}],
        cleaning:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "class":"vendor-div", "html":function(){return "<div> Book Now </div>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"due-div", "html":function(){return "<span class='clean-cat'>"+this.category +"</span>";}},
                         //{"tag":"div", "class":"due-div", "html":function(){return "<span class='clean-cat'>"+this.category +"</span>";}},
//                        {"tag":"div", "class":"price-div", "html":function(){return "Type : <span>"+this['paid_free']+"</span>";}}
                    ]}
                ]},
                {"tag":"div", "class":"state-update none-i"}
            ]
        }],
        windshield:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "class":"vendor-div", "html":function(){return "<div> Select This Product </div>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"due-div", "html":function(){return "<span class='service-cat'>"+this.ws_type +"</span>";}},
                        ]
                    }]
                }]
        }],
        vas:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "class":"vendor-div", "html":function(){return "<div> Book Now </div>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"due-div", "html":function(){return "<span class='clean-cat'>"+this.category +"</span>";}},
//                        {"tag":"div", "class":"price-div", "html":function(){return "Type : <span>"+this['paid_free']+"</span>";}}
                    ]}
                ]},
                {"tag":"div", "class":"state-update none-i"}
            ]
        }],
        dealers_old:[{
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

                    {"tag":"div", "html":"<a class='dealer-add-to-cart' href='/cart'>Book Now</a>"}

                ]},
                {"tag":"div","class":"td-price", "children":[
                    // {"tag":"div", "class":"table-parts","html":function(){return "<table><tr><td>Parts</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+parseInt(this.parts_price)+"</td></tr><tr><td>Labour</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.labour_price))+"</td></tr><tr><td>Service Tax</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.labour_price*0.15))+"</td></tr><tr><td>Pick-Up Fee</td><td>:<strike><i style='padding-left:10px' class='fa fa-inr'></i>200</strike><i style='padding-left:10px' class='fa fa-inr'></i>"+ (this.car_bike == 'Car' ? '0': '0')+"</td></tr><tr id = 'total-row' class='total-row'><td>Total</td><td>:<i class='fa fa-inr' style='padding-left:10px'></i>"+(parseInt(this.parts_price)+parseInt(Math.ceil((this.labour_price)))+parseInt(Math.ceil((this.labour_price*0.15)))+parseInt((this.car_bike == 'Car' ? '0': '0')))+"</td></tr></table>";}}
                    {"tag":"div", "class":"table-parts","html":function(){return "<table><tr><td>Parts</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+parseInt(this.parts_price)+"</td></tr><tr><td>Labour</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.labour_price))+"</td></tr><tr><td>Pick-Up Fee</td><td>:<strike><i style='padding-left:10px' class='fa fa-inr'></i>200</strike><i style='padding-left:10px' class='fa fa-inr'></i>"+ (this.car_bike == 'Car' ? '0': '0')+"</td></tr><tr id = 'total-row' class='total-row'><td>Total</td><td>:<i class='fa fa-inr' style='padding-left:10px'></i>"+(parseInt(this.parts_price)+parseInt(Math.ceil((this.labour_price)))+parseInt((this.car_bike == 'Car' ? '0': '0')))+"</td></tr></table>";}}

                    ]},
                {"tag":"div","class":"col-item td-rating", "html":""}
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
                    {"tag":"div", "class":"text","html":function(){
                         if(this.type_service == 'Not Defined'){
                                    return 'Minor Servicing';
                                }else{
                                    return this.type_service;
                                }}},
                    //{"tag":"div", "class":"sub-text","html":"(${odometer}km)"}
                ]},
                {"tag":"div","class":"col-item td-dealer-select", "children":[
                    // {"tag":"div", "class":"dealer-checkout", "html":"<a href='/checkout'>Checkout</a>"},

                    {"tag":"div", "html":"<a class='dealer-add-to-cart' href='/cart'>Book Now</a>", "class":"none-i"},
                    {"tag":"div", "html":"<a class='servicing-form-generate'>Book Now</a>"}
                ]},
                {"tag":"div","class":"td-price", "children":[
                    {"tag":"div", "class":"table-prices","html":function(){
                        //if(this.vendor=='Authorized'){
                        var parts_row = '',labour_row = '',service_row = '', total_row = '';
                        var t_header = '<tr><th></th><th></th></tr>'
                            if(this.prices && this.prices.length > 1 && this.prices[1]){
                                t_header = "<tr><th></th><th>ClickGarage</th><th></th><th class='price'>Authorized</th></tr>";
                                parts_row = "</td><td> </td><td class='smallFont'><i class='fa fa-inr'></i>"+parseInt(this.prices[1].parts_price)
                                labour_row = "</td><td> </td><td class='smallFont'><i class='fa fa-inr'></i>"+Math.ceil((this.prices[1].labour_price))
                                // service_row = "</td><td> </td><td class='smallFont'><i class='fa fa-inr'></i>"+Math.ceil((this.prices[1].labour_price*0.15))
                                total_row = "<td> </td>" +
                                     "<td class='' style='text-align: right;'><i class='fa fa-inr'></i>"+(parseInt(this.prices[1].parts_price)+parseInt(Math.ceil((this.prices[1].labour_price))))+
                                     "</td>";
                            }
                            if(this.car_bike=='Bike'){
                                 return "<table>" +
                                     t_header+
                                     "<tr><td>Parts</td><td class='price'><i style='padding-left:10px' class='fa fa-inr'></i>"+parseInt(this.prices[0].parts_price)+parts_row+"</td></tr>" +
                                     "<tr><td>Labour</td><td class='price'><i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.prices[0].labour_price))+labour_row+"</td></tr>" +
                                     // "<tr><td>Service Tax</td><td class='price'><i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.prices[0].labour_price*0.15))+service_row+"</td></tr>" +

//                                     (this.vendor == "ClickGarage Doorstep" ? "": "<tr><td>Pick-Up Fee</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>150</td></tr>")+
                                     "<tr id = 'total-row' class='total-row'>" +
                                     "<td>Total</td>" +
                                     "<td class='price'><i class='fa fa-inr' style='padding-left:10px'></i>"+(parseInt(this.prices[0].parts_price)+parseInt(Math.ceil((this.prices[0].labour_price))))+
//                                     parseInt((this.vendor == "ClickGarage Doorstep" ? "0": "150"))+
                                     "</td>" +
                                     total_row +
                                     "</tr>" +
                                     "</table>" +
                                     "Note - Price can vary depending on additional parts required";
                                //var s = '<Table>'
                                //$.each(this.part_dic,function(i,elem){
                                //    s += '<tr><td>'+elem.part_name+"</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+parseInt(this.part_price)+"</td></tr>"
                                //    })
                                //    s += "<tr><td>Labour</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.labour_price))+"</td></tr><tr><td>Service Tax</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.labour_price*0.15))+"</td></tr><tr><td>Pick-Up Fee</td><td>:<strike><i style='padding-left:10px' class='fa fa-inr'></i>200</strike><i style='padding-left:10px' class='fa fa-inr'></i>"+ (this.car_bike == 'Car' ? '0': '0')+"</td></tr>"
                                //    s += '</table>'
                                //    return s

                           // }else{
                           //return "<table><tr>&nbspService Centre Bill Amount</tr><tr><td></td><td>+</td></tr><td>Pick-Up Fee</td><td>:<strike><i style='padding-left:10px' class='fa fa-inr'></i>200</strike><i style='padding-left:10px' class='fa fa-inr'></i>"+ (this.car_bike == 'Car' ? '0': '0')+"</td></tr></table>";
                           // }
                        }else{
                            return "<table>" +
                                     t_header+
                                "<tr><td>Parts</td><td class='price'><i style='padding-left:10px' class='fa fa-inr'></i>"+parseInt(this.prices[0].parts_price)+parts_row+"</td></tr>" +
                                "<tr><td>Labour</td><td class='price'><i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.prices[0].labour_price))+labour_row+"</td></tr>" +
                                // "<tr><td>Service Tax</td><td class='price'><i style='padding-left:10px' class='fa fa-inr'></i>"+Math.ceil((this.prices[0].labour_price*0.15))+service_row+"</td></tr>" +
//                                "<tr><td>Pick-Up Fee</td><td>:<strike><i style='padding-left:10px' class='fa fa-inr'></i>200</strike><i style='padding-left:10px' class='fa fa-inr'></i>"+ (this.car_bike == 'Car' ? '0': '0')+"</td></tr>" +
                                "<tr id = 'total-row' class='total-row'>" +
                                "<td>Total</td>" +
                                "<td class='price'><i class='fa fa-inr' style='padding-left:10px'></i>"+(parseInt(this.prices[0].parts_price)+parseInt(Math.ceil((this.prices[0].labour_price))))+
//                                parseInt((this.car_bike == 'Car' ? '0': '0'))+
                                "</td>" +
                                 total_row +
                                "</tr>" +
                                "</table>";
                    }}}
                    ]},
                {"tag":"div","class":"col-item td-rating", "html":""},
                {"tag":"div","class":"none-i", "html":function(){
                    if(Global && Global.dealerAddressObj){
                        if(this.vendor == 'Authorized'){
                            Global.dealerAddressObj[this.brand] = this.dealer_details;
                        }
                    }
                    return JSON.stringify({'dealer_details':this.dealer_details, 'brand':this.brand, 'vendor':this.vendor});
                }}

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
                    {"tag":"div", "class":"text", "children":[
                        {"tag":"span","class":"car-care", "html":"${service}"},
                        //{"tag":"span", "class":"info-icon fr","html":"Info <i class='fa fa-info-circle'></i>"},
                    ]},
                    {"tag":"div", "class":"sub-text","html":"(${category})"},
                    {"tag":"div", "class":"info","html":"${description}"},
                    {"tag":"div", "class":"doorstep-div", "html":function(){
                        if(this.doorstep=="1"){return "<span class='doorstep'><i class='fa fa-home'></i>&nbspDoorstep Service</span>"
                        }else{
                            return ''
                        }}},
                    {"tag":"div","class":"description tooltip-wrapper","children":[
                        {"tag":"div","class":"tri-tip"},
                        {"tag":"div","class":"tooltip-box","html":"${description}"}
                    ]},
                    {"tag":"div", "class":"description none-i","html":"${description}"},
                ]},
                {"tag":"div","class":"col-item td-dealer-select", "children":[
                    // {"tag":"div", "class":"dealer-checkout", "html":"<a href='/checkout'>Checkout</a>"},
                    {"tag":"div", "html":"<a class='dealer-add-to-cart' href='/cart'>Book Now</a>"}
                ]},
                {"tag":"div","class":"col-item td-price", "children":[
    {"tag":"div", "class":"table-parts","html":function(){return "<table><tr><td>Service Price</td><td>:"+(this.discount=='0' ? '' : "<strike>")+"<i style='padding-left:10px' class='fa fa-inr'></i>"+this.total_price + (this.discount=='0' ? '' : "</strike>&nbsp<i style='padding-left:10px' class='fa fa-inr'></i>") + (this.discount=='0' ? '' : parseInt(parseFloat(this.total_price)*(1.0-parseFloat(this.discount))))+ "</td></tr>"+ (this.doorstep == '0' ? "<tr><td>Pick-Up Fee</td><td>:<strike><i style='padding-left:10px' class='fa fa-inr'></i>200</strike><i style='padding-left:10px' class='fa fa-inr'></i>0</td></tr>" : '')+"<tr><td>Total</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+parseInt(parseFloat(this.total_price)*(1.0-parseFloat(this.discount)))+"</td></tr></table>";}}                ]},
                {"tag":"div","class":"col-item td-rating", "html":""}
            ]
        }],
        packages_vas:[{
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
                     {"tag":"div", "class":"text", "children":[
                        {"tag":"span","class":"car-care", "html":"${service}"},
                        //{"tag":"span", "class":"info-icon fr","html":"Info <i class='fa fa-info-circle'></i>"},
                    ]},
                    {"tag":"div", "class":"sub-text","html":"(${category})"},
                    {"tag":"div", "class":"info","html":"${description}"},
                    {"tag":"div", "class":"doorstep-div", "html":function(){
                        if(this.doorstep=="1"){return "<span class='doorstep'><i class='fa fa-home'></i>&nbspDoorstep Service</span>"
                        }else{
                            return ''
                        }}},
                    {"tag":"div","class":"description tooltip-wrapper","children":[
                        {"tag":"div","class":"tri-tip"},
                        {"tag":"div","class":"tooltip-box","html":"${description}"}
                    ]},
                    {"tag":"div", "class":"description none-i","html":"${description}"},
                ]},
                {"tag":"div","class":"col-item td-dealer-select", "children":[
                    // {"tag":"div", "class":"dealer-checkout", "html":"<a href='/checkout'>Checkout</a>"},
                    {"tag":"div", "html":"<a class='dealer-add-to-cart' href='/cart'>Book Now</a>"}
                ]},
                {"tag":"div","class":"col-item td-price", "children":[
    {"tag":"div", "class":"table-parts","html":function(){return "<table><tr><td>Service Price</td><td>:"+(this.discount=='0' ? '' : "<strike>")+"<i style='padding-left:10px' class='fa fa-inr'></i>"+this.total_price + (this.discount=='0' ? '' : "</strike>&nbsp<i style='padding-left:10px' class='fa fa-inr'></i>") + (this.discount=='0' ? '' : parseInt(parseFloat(this.total_price)*(1.0-parseFloat(this.discount))))+ "</td></tr>"+ (this.doorstep == '0' ? "<tr><td>Pick-Up Fee</td><td>:<strike><i style='padding-left:10px' class='fa fa-inr'></i>200</strike><i style='padding-left:10px' class='fa fa-inr'></i>0</td></tr>" : '')+"<tr><td>Total</td><td>:<i style='padding-left:10px' class='fa fa-inr'></i>"+parseInt(parseFloat(this.total_price)*(1.0-parseFloat(this.discount)))+"</td></tr></table>";}}                ]},
                {"tag":"div","class":"col-item td-rating", "html":""}
            ]
        }],
        
        ws_subtype:[{
            "tag":"div","class":"dealer-list-item","data-id":"${id}", "data-name":"${vendor}", "children":[
                {"tag":"div","class":"td-dealer-info", "children":[
                    {"tag":"div", "class":"vendor-name","html":function(){
                        return this.vendor;
                    }},
                    {"tag":"div", "class":"dealer-logo-wrapper", "html":function(){
                        return '<img src="'+logoMap[$.trim(this.vendor)]+'" alt="'+this.vendor+'" /><div class="aligner"></div>';
                    }},
                ]},
                {"tag":"div","class":"td-service-info", "children":[
                    {"tag":"div", "class":"parts-div","html":function(){
                        var html = '';
                        if(this.ws_type=='Door Glass'){
                            html += this.ws_subtype+' '+this.ws_type;
                        }
                        else{
                            html += this.ws_type;
                        }
                        return html;
                    }},
                    {"tag":"div", "class":"parts-div","html":function(){
                        var html = '';
                        if(this.ws_subtype=='With Defogger'){
                                html += '<span class="token-class">'+this.ws_subtype+'</span>&nbsp;';}
                        if(this.colour=='Green'){
                                html += '<span class="token-class">Green Tinted</span>&nbsp;';}
                        return html;
                    }},
                    {"tag":"div", "class":"text","html":function(){
                        return '<span class="doorstep"><i class="fa fa-home"></i>&nbspDoorstep Service</span>';
                    }}
                ]},
                {"tag":"div","class":"col-item td-dealer-select", "children":[
                    // {"tag":"div", "class":"dealer-checkout", "html":"<a href='/checkout'>Checkout</a>"},

                    {"tag":"div", "html":"<a class='dealer-add-to-cart', href='/cart'>Book Now</a>"}
                ]},
                {"tag":"div","class":"td-price", "children":[
                    {"tag":"div", "class":"text","html":function(){
                        if(this.price_total=='NA'){
                            return "Conveyed post booking"
                        }
                        else {
                            return 'Price (incl taxes) :'+'<i style="padding-left:10px" class="fa fa-inr"></i> '+parseInt(Math.ceil((this.price_total)));
                        }
                    }}
                    ]},
                {"tag":"div","class":"col-item td-rating", "html":""}
            ]
        }],
        package_popup:{
            servicing:[
                {"tag":"div","class":"form-wrapper","id":"dealer-pick-form","children":[
                    {"tag":"div","class":"form-title","html":function(){}},
                    {"tag":"div","class":"form-workflow", "children":[
                        {"tag":"div", "class":"f-step step-1 done", "html":"<div class='f-circle'>1</div> <div class='f-text'>Select Your Service</div><div class='f-checky'><i class='fa fa-check'></i></div>"},
                        {"tag":"div", "class":"f-step step-2 current", "html":"<div class='f-circle'>2</div> <div class='f-text'>Specify Additional Details</div><div class='f-checky'><i class='fa fa-check'></i></div>"},
                        {"tag":"div", "class":"f-step step-3 todo", "style":function(){
                            if(this.dealer != 'Authorized'){
                                return "display:none;"
                            }else{
                                return ""
                            }
                        }, "html":"<div class='f-circle'>3</div> <div class='f-text'>Select Service Center</div><div class='f-checky'><i class='fa fa-check'></i></div>"}
                    ]},
                    {"tag":"div","class":"form-step-holder","children":[
                        {"tag":"div","class":"additional-queries step-2","children":[
                            {"tag":"div", "class":"form-row additional", "children":[
                                {"tag":"div", "class":"form-col label-col", "children":[
                                    {"tag":"div", "class":"label-div","html":"Additional Queries"}
                                ]},
                                {"tag":"div", "class":"form-col inp-col-1", "html":function(){
                                    return((json2html.transform(this.additionalFeaturesOdd, Templates.orderPage.package_popup.features)));
                                }},
                                {"tag":"div", "class":"form-col inp-col-2", "html":function(){
                                    return((json2html.transform(this.additionalFeaturesEven, Templates.orderPage.package_popup.features)));
                                }}
                            ]},
                            {"tag":"div", "class":"form-row additional", "children":[
                                {"tag":"div", "class":"form-col label-col", "children":[
                                    {"tag":"div", "class":"label-div","html":"Custom Requests"}
                                ]},
                                {"tag":"div", "class":"form-col inp-col-double", "children":[
                                    {"tag":"div", "class":"clean-inp-wrapper", "html":"<textarea class='clean-inp-tabox cust-req' type='' rows='3'></textarea>"}
                                ]}
                            ]},
                        ]},
                        {"tag":"div","class":"select-dealer step-3", "style":"display:none", "children":[
                            {"tag":"div", "class":"form-row","children":[
                                {"tag":"div", "class":"form-col label-col", "html":"<div>&nbsp;</div>"},
                                {"tag":"div", "class":"form-col inp-col-double", "html":"<div class='clean-inp-wrapper'><input type='radio' name='dealer-show-hide' value='show'>I have a preferred service center</div>"}
                            ]},
                            {"tag":"div", "class":"form-row","children":[
                                {"tag":"div", "class":"form-col label-col", "html":"<div>&nbsp;</div>"},
                                {"tag":"div", "class":"form-col inp-col-double", "html":"<div class='clean-inp-wrapper'><input type='radio' name='dealer-show-hide' value='hide'>Choose a service center for me</div>"}
                            ]},
                            {"tag":"div", "class":"form-row group-pick", "style":"display:none;", "children":[
                                {"tag":"div", "class":"form-col label-col", "html":"<div>Select dealer:</div>"},
                                {"tag":"div", "class":"form-col inp-col-1", "html":"<div class='clean-inp-wrapper'><input type='radio' name='dealer-group-by' value='region'>By Region</div>"},
                                {"tag":"div", "class":"form-col inp-col-2", "html":"<div class='clean-inp-wrapper'><input type='radio' name='dealer-group-by' value='dealer'>By Dealer</div>"}
                            ]},
                            {"tag":"div", "class":"form-row dealer-grouped","children":[
                                {"tag":"div", "class":"form-col", "children":[
                                    {"tag":"div", "class":"label-div", "html":"Dealer"},
                                    {"tag":"div", "class":"clean-inp-wrapper", "children":[
                                        {"tag":"label", "class":"clean-sbox-wrapper", "children":[
                                            {"tag":"select", "class":"clean-inp-sbox dealer-name", "html":function(){
                                                var html = '';
                                                if(this.dealerGrouped){
                                                $.each(this.dealerGrouped, function(i,v){
                                                    html += '<option value="'+v+'">'+v+'</option>';
                                                });
                                                }
                                                return html;
                                            }}
                                        ]}
                                    ]}
                                ]},
                                {"tag":"div", "class":"form-col", "children":[
                                    {"tag":"div", "class":"label-div", "html":"Address"},
                                    {"tag":"div", "class":"clean-inp-wrapper", "children":[
                                        {"tag":"label", "class":"clean-sbox-wrapper", "children":[
                                            {"tag":"select", "class":"clean-inp-sbox dealer-address", "html":""}
                                        ]}
                                    ]}

                                ]}
                            ]},
                            {"tag":"div", "class":"form-row region-grouped","children":[
                                {"tag":"div", "class":"form-col", "children":[
                                    {"tag":"div", "class":"label-div", "html":"Pick City"},
                                    {"tag":"div", "class":"clean-inp-wrapper", "children":[
                                        {"tag":"label", "class":"clean-sbox-wrapper", "children":[
                                            {"tag":"select", "class":"clean-inp-sbox dealer-city", "html":function(){
                                                var html = '';
                                                if(this.regionGrouped){
                                                $.each(this.regionGrouped, function(i,v){
                                                    html += '<option value="'+v+'">'+v+'</option>';
                                                });
                                                }
                                                return html;
                                            }}
                                        ]}
                                    ]}
                                ]},
                                {"tag":"div", "class":"form-col", "children":[
                                    {"tag":"div", "class":"label-div", "html":"Pick Region"},
                                    {"tag":"div", "class":"clean-inp-wrapper", "children":[
                                        {"tag":"label", "class":"clean-sbox-wrapper", "children":[
                                            {"tag":"select", "class":"clean-inp-sbox dealer-region", "html":""}
                                        ]}
                                    ]}
                                ]},
                                {"tag":"div", "class":"form-col", "children":[
                                    {"tag":"div", "class":"label-div", "html":"Pick Dealer"},
                                    {"tag":"div", "class":"clean-inp-wrapper", "children":[
                                        {"tag":"label", "class":"clean-sbox-wrapper", "children":[
                                            {"tag":"select", "class":"clean-inp-sbox dealer-name-address", "html":""}
                                        ]}
                                    ]}
                                ]}
                            ]},
                        ]}

                    ]},
                    {"tag":"div","class":"form-btn-holder","children":[
                        {"tag":"div", "class":"form-btn", "style":function(){
                            if(this.dealer == 'Authorized'){
                                return "display:none;"
                            }else{
                                return ""
                            }
                        }, "html":"<a class='detail-add-to-cart' href='/cart'>Book Now</a>"},
                        {"tag":"div", "class":"form-btn form-nav-btn next", "style":function(){
                            if(this.dealer != 'Authorized'){
                                return "display:none;"
                            }else{
                                return ""
                            }
                        }, "html":"<span class='detail-form-next'>Next</span>"},
                        {"tag":"div", "class":"form-btn form-nav-btn prev", "style":"display:none;", "html":"<span class='detail-form-prev'>Back</span>"}
                    ]}
                ]},
//                {"tag":"i","class":"close-btn fa fa-close"}
            ],
            features:[
                {"tag":"div", "class":"clean-inp-wrapper", "html":function(){
                    var html = '';
                    html += '<input class="clean-inp-cbox" name="'+this+'" type="checkbox">';
                    html += '<div class="label-div">'+this+'</div>';
                    return html;
                }}
            ]
        }

    },
    bookingPage:{
        booking_new:[{
            "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                {"tag":"div", "class":"top-row", "children":[
                    {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                        {"tag":"div", "id":"cancel-booking",  "tran_id":"${tran_id}", "class":"vendor-div none-i", "html":function(){return "<div> Cancel Booking </div>";}}
                    ]},

                    {"tag":"div", "class":"wrapper header-wrapper", "children":[
                        {"tag":"div", "class":"booking id booking_id", "html":function(){return '#'+(this.booking_id);}},
                        {"tag":"div", "class":"booking car booking_car", "html":function(){return (this.cust_carname);}},
                        {"tag":"div", "class":"booking date booking_date", "html":function(){return (this.date_booking) + ' ('+this.time_booking+')';}},
                        {"tag":"div", "class":"booking list booking_list",
                        //    "html":function(){
                        //    var s = '<ul class="service-components">'
                        //    $.each(this.service_items,function(i,elem){
                        //        if(elem.service == 'servicing'){
                        //        s += '<li class="indiv_booking" style="height: 90px;">'+elem.served_data.dealer_cat+'  <i class="fa fa-caret-right"></i>  '+ elem.served_data.odometer+'km (Regular Sevicing) <div id="cancel-booking" tran_id="561ac69396f69553e74fe545" class="vendor-div" style="padding: 0px; float: right;"><div> Cancel Booking </div></div></li>'
                        //        }else{
                        //        s += '<li class="indiv_booking" style="height: 90px;">'+elem.served_data.vendor +'  <i class="fa fa-caret-right"></i>  '+ elem.served_data.service+' ( '+elem.served_data.category+' ) <div id="cancel-booking" tran_id="561ac69396f69553e74fe545" class="vendor-div" style="padding: 0px; float: right;"><div> Cancel Booking </div></div></li>'
                        //        }
                        //    })
                        //    s += '</ul>'
                        //    return s
                        //},
                        "children": [
                            {"tag":"ul", "class":"service-components", "html":function(){
                                var _booking = this;
                                var s = ''
                                $.each(this.service_items,function(i,elem){

                                    if(elem.service == 'servicing'){
                                        s += '<li class="indiv_booking" style="height: 90px;">'+elem.served_data.dealer_cat+'  <i class="fa fa-caret-right"></i>  '
                                        if(elem.served_data.type_service == "Not Defined"){
                                            s+="Minor Servicing</li>"
                                        }else{
                                            s+=elem.served_data.type_service + '</li>'
                                        }
                                        s += '</li><div id="cancel-booking" tran_id="'+_booking.tran_id+'" item_id="'+elem.served_data.ts+'" class="vendor-div" style="padding: 0px; float: right;"><div> Cancel Booking </div></div></li>'
                                    }else{
                                    s += '<li class="indiv_booking" style="height: 90px;">'+elem.served_data.vendor +'  <i class="fa fa-caret-right"></i>  '+ elem.served_data.service+' ( '+elem.served_data.category+' ) <div id="cancel-booking" tran_id="'+_booking.tran_id+'" item_id="'+elem.served_data.ts+'" class="vendor-div" style="padding: 0px; float: right;"><div> Cancel Booking </div></div></li>'
                                    }
                                })
                                return s;
                            }}
                        ]
                        },    
                        
                        ]},
    

                ]},
        
            ]
        }],
        cancelled_new:[{
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
                                s += '<li class="indiv_booking">'+elem.served_data.dealer_cat+'  <i class="fa fa-caret-right"></i>  '
                                 if(elem.served_data.type_service=="Not Defined"){
                                     s+="Minor Servicing"
                                 }else{
                                     s+=elem.served_data.type_service
                                 }
                                 s += '</li>'
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
        booking:[{
                "tag":"div","class":"service-list-item minimized", "data-id":"${id}", "children":[
                    {"tag":"div", "class":"top-row", "children":[
                        {"tag":"div", "class":"wrapper detail-wrapper", "children":[
                            {"tag":"div", "id":"cancel-booking",  "tran_id":"${tran_id}", "class":"vendor-div", "html":function(){return '<div> Cancel Booking </div>';}}
                        ]},

                        {"tag":"div", "class":"wrapper header-wrapper", "children":[
                            {"tag":"div", "class":"booking id booking_id", "html":function(){return '#'+(this.booking_id);}},
                            {"tag":"div", "class":"booking car booking_car", "html":function(){return (this.cust_carname);}},
                            {"tag":"div", "class":"booking date booking_date", "html":function(){return (this.date_booking) + ' ('+this.time_booking+')';}},
                            {"tag":"div", "class":"booking list booking_list", "html":function(){
                                var s = '<ul class="service-components">'
                                $.each(this.service_items,function(i,elem){
                                    if(elem.service == 'servicing'){
                                        if(elem.served_data){
                                        s += '<li class="indiv_booking">'+elem.served_data.dealer_cat+'  <i class="fa fa-caret-right"></i>  '
                                            if(elem.served_data.type_service && elem.served_data.type_service=="Not Defined"){
                                                s+="Minor Servicing </li>"
                                            }else if(elem.served_data.type_service){
                                                s+= elem.served_data.type_service + '</li>'
                                            }else{
                                                s += elem.served_data.odometer+'km / '+elem.served_data.year
                                            }
                                        }
                                      } else if (elem.service == 'emergency' || elem.service == 'repair') {
                                        s += '<li class="indiv_booking">' + elem.service.toTitleCase() + '</li>'
                                    }else{
                                    s += '<li class="indiv_booking">'+ elem.served_data.vendor +'  <i class="fa fa-caret-right"></i>  '+ elem.served_data.service +' ( '+elem.served_data.category+' ) </li>'
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
            "tag": "div", "class": "service-list-item minimized", "data-id": "${id}", "children": [
                {
                    "tag": "div", "class": "top-row", "children": [

                    {
                        "tag": "div", "class": "wrapper header-wrapper", "children": [
                        {
                            "tag": "div", "class": "booking id booking_id", "html": function () {
                            return '#' + (this.booking_id);
                        }
                        },
                        {
                            "tag": "div", "class": "booking car booking_car", "html": function () {
                            return (this.cust_carname);
                        }
                        },
                        {
                            "tag": "div", "class": "booking date booking_date", "html": function () {
                            return (this.date_booking) + ' (' + this.time_booking + ')';
                        }
                        },
                        {
                            "tag": "div", "class": "booking list booking_list", "html": function () {
                            var s = '<ul class="service-components">'
                            $.each(this.service_items, function (i, elem) {
                                if (elem.service == 'servicing') {
                                    if(elem.served_data) {
                                        s += '<li class="indiv_booking">' + elem.served_data.dealer_cat + '  <i class="fa fa-caret-right"></i>  '
                                        if (elem.served_data.type_service && elem.served_data.type_service == "Not Defined") {
                                            s += "Minor Servicing </li>"
                                        } else if(elem.served_data.type_service) {
                                            s += elem.served_data.type_service + '</li>'
                                        } else {
                                            s += elem.served_data.odometer+'km / '+elem.served_data.year
                                        }
                                    }
                                } else if (elem.service == 'emergency' || elem.service == 'repair' ) {
                                    s += '<li class="indiv_booking">' + elem.service.toTitleCase() + '</li>'
                                } else {
                                    s += '<li class="indiv_booking">' + elem.served_data.vendor + '  <i class="fa fa-caret-right"></i>  ' + elem.served_data.service + ' ( ' + elem.served_data.category + ' ) </li>'
                                }
                            })
                            s += '</ul>'
                            return s
                        }
                        },

                    ]
                    },


                ]
                },

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
    getDateFromFormat : function(date, format) {
        if (date instanceof Date){
            function one2two(val) {
                if (val < 9) {
                    val = '0' + val;
                }
                return val;
            }
        if (format == 'dd/mm/yyyy') {
            return one2two(date.getDate()) + '/' + (one2two(date.getMonth() + 1) + '/' + (1900 + date.getYear()));
        } else if (format == 'mm/dd/yyyy') {
            return (one2two(date.getMonth() + 1) + '/' + one2two(date.getDate()) + '/' + (1900 + date.getYear()));
        }
        }else{
            return 'invalid date'
        }
    },
    addressForm : function(container){

        var valid = function(str){
            if(!str || !(str.length)){
                return false
            }
            return true;
        };
        var user_name = $(container).find('.user-name').val();
        var user_number = $(container).find('.user-number').val();
        var user_email = $(container).find('.user-email').val();

//        var car_reg_number = $(container).find('.car-reg-no').val();
        var pick_date = $(container).find('.pick-up-date').val();
        var pick_time = $(container).find('.pick-up-time').val();
        var pick_addr_1 = $(container).find('.pick-addr-1').val();
        var pick_addr_2 = $(container).find('.pick-addr-2').val();
//        var pick_pin = $(container).find('.pick-pin').val();
//        var pick_lmark = $(container).find('.pick-lmark').val();

//        var dropMatch = $(container).find('.pick-drop-toggle').is(':checked');

//        var drop_addr = $(container).find('.drop-addr').val();
//        var drop_pin = $(container).find('.drop-pin').val();
//        var drop_lmark = $(container).find('.drop-lmark').val();

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
        if(!valid(user_email)){
            $(container).find('.user-email').addClass('error');
            return false;
        }else if(!formCheck.isValidEmailAddress(user_email)){
            $(container).find('.user-email').addClass('error');
            return false;
        }

        if(!valid(pick_addr_1) && !valid(pick_addr_2)){
            $(container).find('.pick-addr-1').addClass('error');
            return false
        }


        if(!valid(pick_date)){
            $(container).find('.pick-up-date').addClass('error');
            return false
        }
        if(!valid(pick_time)){
            $(container).find('.pick-up-time').addClass('error');
            return false
        }

        //if(!valid(pick_pin)){
        //    $(container).find('.pick-pin').addClass('error');
        //    return false
        //}else{
        //    console.log(pick_pin.length)
        //    if(isNaN(parseInt(pick_pin)) || pick_pin.length != 6){
        //        $(container).find('.pick-pin').addClass('error');
        //        return false
        //    }
        //}
        //if(!valid(car_reg_number)){
        //    $(container).find('.car-reg-no').addClass('error');
        //    return false
        //}else{
        //    if(car_reg_number.length > 10){
        //        $(container).find('.car-reg-no').addClass('error');
        //        return false
        //    }
        //}

//        if(!valid(drop_addr)){
//            $(container).find('.drop-addr').addClass('error');
//            return false
//        }

//        if(!valid(drop_pin)){
//            $(container).find('.drop-pin').addClass('error');
//            return false
//        }else{
////            console.log(pick_pin.length)
//            if(isNaN(parseInt(drop_pin)) || drop_pin.length != 6){
//                $(container).find('.drop-pin').addClass('error');
//                return false
//            }
//        }
//        if(!valid(pick_lmark)){
//            $(container).find('.pick-lmark').addClass('error');
//            return false
//        }
        return true;
    },
    emergAddressForm : function(container){

        var valid = function(str){
            if(!str || !(str.length)){
                return false
            }
            return true;
        };
        var user_name = $(container).find('.user-name').val();
        var user_number = $(container).find('.user-number').val();
//        var car_reg_number = $(container).find('.car-reg-no').val();

        var pick_addr_1 = $(container).find('.pick-addr-1').val();
        var pick_addr_2 = $(container).find('.pick-addr-2').val();
//        var pick_pin = $(container).find('.pick-pin').val();
//        var pick_lmark = $(container).find('.pick-lmark').val();


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


        if(!valid(pick_addr_1) && !valid(pick_addr_2)){
            $(container).find('.pick-addr-1').addClass('error');
            return false
        }
//        if(!valid(pick_pin)){
//            $(container).find('.pick-pin').addClass('error');
//            return false
//        }else{
//            console.log(pick_pin.length)
//            if(isNaN(parseInt(pick_pin)) || pick_pin.length != 6){
//                $(container).find('.pick-pin').addClass('error');
//                return false
//            }
//        }
//        if(!valid(car_reg_number)){
//            $(container).find('.car-reg-no').addClass('error');
//            return false
//        }else{
//            if(car_reg_number.length > 10){
//                $(container).find('.car-reg-no').addClass('error');
//                return false
//            }
//        }
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
    getSelectedAddress : function(container,formType){
        var user_name = $(container).find('.user-name').val();
        var user_number = $(container).find('.user-number').val();
var email = $(container).find('.user-email').val();
//        var car_reg_number = $(container).find('.car-reg-no').val();
        var pick_addr_1 = $(container).find('.pick-addr-1').val();
        var pick_addr_2 = $(container).find('.pick-addr-2').val();
//        var pick_pin = $(container).find('.pick-pin').val();
//        var pick_lmark = $(container).find('.pick-lmark').val();
        var pick_city = $(container).find('.pick-city.perpetual').val();
        var pick_time = $(container).find('.pick-up-time').val();
        var pick_date = $(container).find('.pick-up-date').val();

/*
        var drop_addr = $(container).find('.drop-addr').val();
        var drop_pin = $(container).find('.drop-pin').val();
        var drop_lmark = $(container).find('.drop-lmark').val();
        var drop_city = $(container).find('.drop-city').val();
*/

        var obj = {};

        if(formType && formType == 'emergency'){
            var date = new Date();
            var hrs = date.getHours();
            if(hrs<10){
                hrs = '0'+hrs
            }
            var mts = date.getMinutes();
            if(mts<10){
                mts = '0'+mts
            }
            obj = {
                name : user_name,
                number : user_number,
		email : email,
//                reg_no : car_reg_number,
                pick:{
                    street : pick_addr_1,
                    locality : pick_addr_2,
                    city : pick_city,
                    time : ((hrs) + ':' + (mts)),
                    date : ((date.getMonth()+1) + '/' + (date.getDate()) + '/' +(date.getYear()))
                }
            };
//                orderItem['date'] = (date.getMonth()+1) + '/' + (date.getDate()) + '/' +(date.getYear());
//                orderItem['time'] = (date.getHours()) + ':' + (date.getMinutes());

        }else{
            obj = {
                name : user_name,
                number : user_number,
		email : email,
//                reg_no : car_reg_number,
                pick:{
                    street : pick_addr_1,
                    locality : pick_addr_2,
//                    pincode : pick_pin,
//                    landmark : pick_lmark,
                    city : pick_city,
                    time : pick_time,
                    date : pick_date
//                },
//                drop:{
//                    street : drop_addr,
//                    pincode : drop_pin,
//                    landmark : drop_lmark,
//                    city : drop_city
                }
            };
        }
        return obj;
    },
    isValidEmailAddress : function(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    },
    afterSendContact: function(data){
        console.log(data)
        //var btn = $('[tran_id="'+data['cancelled_id']+'"]')
        btn.find('div').text('Sent')
        //btn.addClass('cancelled_booking')
    },
    updateTime : function(container){
            var todayFlag = false;
            var sameDay = false;
            if($(container).find('#date-wrap .pick-up-date').val() == formCheck.getDateFromFormat((new Date()), 'mm/dd/yyyy')){
                todayFlag = true;
            }
            if($('#same-day-toggle').is(':checked')){
                sameDay = true;
            }

            var thisHour = (new Date()).getHours() + 2;
            var thisMinute = (new Date()).getMinutes();
                thisHour += 1
            if(thisHour < 9)
                thisHour = 9
            if(thisHour >17)
                thisHour = 17
            var hr =  $(container).find('#time-wrap .pick-up-time').val();
            var ampm = $(container).find('#time-wrap .pick-up-time').val();
            if(hr){
                hr = hr.split(':')[0];
                hr = parseInt(hr);
            }
        if(ampm){
            ampm = ampm.split(' ')[1];
        }
        if(hr && !isNaN(hr) && (hr != 12) && ampm == 'PM'){
            hr = hr + 12
        }

            var minTime = new Date(0,0,0,thisHour,0,0);
            //var maxTime = new Date(0,0,0,12,0,0);
            if(todayFlag){
                $(container).find('#time-wrap .pick-up-time').timepicker('option', 'minTime',minTime);
//                console.log(hr, thisHour)
                if(hr < thisHour){
                $(container).find('#time-wrap .pick-up-time').timepicker('setTime',minTime);
                    alert('Pick up time slots start from 2 hours after booking time');
                }
            }else{
                $(container).find('#time-wrap .pick-up-time').timepicker('option', 'minTime',new Date(0,0,0,9,0,0));
            }
        if(todayFlag && sameDay && thisHour>11){
            alert('We are unable to process any same day delivery bookings for today. Please book for any other day for same day delivery.');
            $(container).find('#same-day-toggle').prop('checked', false);
        }else{
            if(sameDay){
                var maxSameDayHr = 11;
                if(zyxCart.carData && zyxCart.carData.car_bike == 'Bike'){
                    maxSameDayHr = 12
                }
                if(hr > maxSameDayHr){
                    $('#same-day-toggle').prop('checked', false);
                    if(maxSameDayHr >= 12){
                    alert('Same day delivery can only be checked for bookings before 12 Noon')
                    }else{
                    alert('Same day delivery can only be checked for bookings before '+maxSameDayHr+' AM');
                    }
                }else{
//                    $(container).find('#time-wrap .pick-up-time').timepicker('option', 'maxTime',new Date(0,0,0,maxSameDayHr,0,0));
                }
            }else{
//                $(container).find('#time-wrap .pick-up-time').timepicker('option', 'maxTime',new Date(0,0,0,17,0,0));
            }
        }
            //$(container).find('.pick-up-time').data('timepicker');

    },



};
