/**
 * Created with PyCharm.
 * User: vociferous
 * Date: 02/08/15
 * Time: 3:17 PM
 * To change this template use File | Settings | File Templates.
 */

var Global = {
    init:function(){
        var _this = this;
        _this.setLayout();
        _this.eventHandlers();
        Commons.eventHandlers();
        if(!_this.carSelected){
            var cookDict = local.load();
            if(cookDict['clgacarid'] && _this.carData){
                _this.carSelected =  $.grep(_this.carData, function(e){ return e.id == cookDict['clgacarid']; })[0];

            }
        }
        if(_this.carSelected){
            $("#selected-details").show();
            $("#selected-details").find('.c-name').html(_this.carSelected.name);
            $("#selected-details").find('.c-make').html(_this.carSelected.make);
        }else{
                _this.generateCarSelect();
        }
        workflowState.init();
        if(workflowState.step.state == 'service'){
            $('.section-select-holder').find('.section-menu-item').eq(0).click();
        }else if(workflowState.step.state == 'dealer'){

        }
//        history.replaceState({state:'servicing'}, null, window.location.href);
    },
    setLayout:function(){
    },
    eventHandlers:function(){
        var _this = this;
        $('.section-box .section-menu-item').on('click', function(e){
            if(!$(this).hasClass('active')){
                $(this).addClass('active');
                $(this).siblings().removeClass('active');
                var classy = $(this).attr('data-class');
//                console.log($(this).closest('.section-box').find('.section-content-item').hide())
                $(this).closest('.section-box').find('.section-content-item').hide();
                var mine = $(this).closest('.section-box').find('.section-content-item').filter('.'+classy).show();
                console.log(classy)
                if(mine.hasClass('loaded')){

                }else{
                    if(classy == 'servicing' || classy == 'cleaning' || classy == 'vas'){
                        Commons.ajaxData('fetch_car_'+classy , {c_id:_this.carSelected.id},"get",_this, eval("_this.load"+classy.toTitleCase()))
                    }
                }
            }else{

            }
//            var stateObj = { foo: "bar" };
        });
        $('.section-box .section-content-item').on('click', '.service-group-item', function(e){
            var $target  = $(e.target);
            if(!$target.closest('.detail-wrapper').length){
                if($(this).hasClass('minimized') ){
                    $(this).siblings().filter('.expanded').removeClass('expanded').addClass('minimized');
                    $(this).removeClass('minimized').addClass('expanded')
                }else if($(this).hasClass('expanded')){
                    $(this).removeClass('expanded').addClass('minimized')
                }else{

                }
            }
        });
        $('.section-box .section-content-item').on('click', '.service-list-item', function(e){
            var $target  = $(e.target);
            if($target.closest('.vendor-div').length || $target.closest('.state-update').length){
                var classy = $(this).closest('.section-content-item').attr('data-class');
                var s_id = $(this).attr('data-id');
                _this.selectedSection = classy;
                if(classy == 'servicing' || classy == 'cleaning' || classy == 'vas'){
                    var data = {};
                    data.state = 'dealer';
                    if($target.closest('.vendor-div').length){
                        workflowState.pushToHistory(data.state, data, '#'+data.state+'?s_id='+s_id);
                        workflowState.setWorkflow(data.state, data, '#'+data.state+'?s_id='+s_id);
                        workflowState.workflowBarUpdate(data.state);
                    }
                    console.log("_this.load"+classy.toTitleCase()+"Details");
                    Commons.ajaxData('fetch_'+classy+'_details', {service_id:s_id, c_id:_this.carSelected.id},"get",_this, eval("_this.load"+classy.toTitleCase()+"Details") )
                }
            }else if($target.closest('.detail-wrapper').length){
                if($(this).hasClass('minimized')){
                    console.log($(this).siblings().filter('.expanded').find('.bot-row'));
                    $(this).siblings().filter('.expanded').find('.bot-row').slideUp(200, function(){
                        $(this).closest('.service-list-item').removeClass('expanded').addClass('minimized');
                    });
                    $(this).removeClass('minimized').addClass('expanded');
                    $(this).find('.bot-row').hide().slideDown(200);
                }else{
                    $(this).find('.bot-row').slideUp(200, function(){
                        console.log($(this));
                        $(this).closest('.service-list-item').removeClass('expanded').addClass('minimized');
                    });
                }
            }
        });
        $('.section-box .section-content-item').on('click', '.service-group-head', function(e){
            if(!$(this).hasClass('selected')){
                $(this).addClass('selected');
                $(this).siblings().removeClass('selected');
                var bodyHolder = $(this).closest('.list-head').siblings().filter('.list-body').eq(0);
                var name = $(this).attr('data-name');
                bodyHolder.find('.service-group-item').hide();
                bodyHolder.find('.service-group-item[data-name="'+name+'"]').show();
            }
        });
        $('.dealer-box ').on('click', '.dealer-checkout, .servicing-form-generate', function(e){
            var obj = {};
            obj.timestamp = (new Date()).getTime();
            obj.service = _this.selectedSection;
            obj.dealer = $(this).closest('.dealer-list-item').attr('data-name');
            obj.s_id = $(this).closest('.dealer-list-item').attr('data-id');
            _this.generateServiceDetailForm(obj);


        });
        $('.dealer-box ').on('click', '.dealer-checkout, .dealer-add-to-cart', function(e){
            var obj = {};
            obj.timestamp = (new Date()).getTime();
            obj.service = _this.selectedSection;
            obj.dealer = $(this).closest('.dealer-list-item').attr('data-name');
            obj.s_id = $(this).closest('.dealer-list-item').attr('data-id');
//            console.log(obj)
//            console.log(local.load());
            var cook_obj = local.load();
            var oldC = '';
            if(cook_obj['clgacart']){
                oldC = cook_obj['clgacart'];
                oldC += ','
            }
            var newC = [obj.timestamp,obj.service, obj.dealer, obj.s_id].join('*');
            Commons.ajaxData('add_to_cart', {'cookie':newC, 'car_id':_this.carSelected.id, 'car_size':_this.carSelected.size}, "get", _this, _this.redirectToCart );

            var dealer = $(this).closest('.dealer-list-item').attr('data-name');
            obj.dealer = dealer.split(' ').join('#$');
            newC = [obj.timestamp,obj.service, obj.dealer, obj.s_id].join('*');
            oldC += newC;
            console.log(oldC);
            local.save('clgacart', oldC);


//            Commons.ajaxData('add_to_cart', {})
        });
        $('#settings-drpdwn').on('click', function(e){
            $(this).parent().find('.logged-user-drpdwn').toggle();
        });

        $('#selected-details .edit-btn').on('click', function(e){
            Global.generateCarSelect();
        });



    },
    
    loadServicing : function(data){
        console.log(data)
        var container = $('.section-box .servicing');
        container.html('');
        container.json2html(data, Templates.orderPage.servicing, {append:true});
//        container.append(json2html.transform(data,Templates.orderPage.services));
        $.each(data, function(idx, val){

        });

    },


    loadServicingDetails : function(data){
        console.log('p',data);
        if(data && data.length){
            var common_data = {};
            var common_keys = ["type_service", "parts_list", "wa_wb_present"];
            $.each(common_keys, function(idx, val){
                common_data[val] = data[0][val]
            });
            $('.section-select-holder').hide();
            $('.dealer-select-holder').show();
            var container = $('.dealer-box .dealer-listings');
            container.html('');
            container.json2html(data, Templates.orderPage.dealers, {append:true});

        }
    },
    loadCleaning : function(data){
        console.log(data);
        var container = $('.section-box .cleaning');
        container.html('');
        container.json2html(data, Templates.orderPage.cleaning, {append:true});

//        var headHolder = $('.section-box .cleaning .list-head');
//        headHolder.html('');
//        headHolder.json2html(data, Templates.orderPage.cleaning.cleaning_group_head, {append:true});
//        var bodyHolder = $('.section-box .cleaning .list-body');
//        bodyHolder.html('');
//        bodyHolder.json2html(data, Templates.orderPage.cleaning.cleaning_group_body, {append:true});


//        container.append(json2html.transform(data,Templates.orderPage.services));
        $.each(data, function(idx, val){

        });
    },
    loadCleaningDetails : function(data){
        console.log('cleaning details',data);
        if(data && data.length){
            var common_data = {};
            var common_keys = ["type_service", "parts_list", "wa_wb_present"];
            $.each(common_keys, function(idx, val){
                common_data[val] = data[0][val]
            });
            $('.section-select-holder').hide();
            $('.dealer-select-holder').show();
            var container = $('.dealer-box .dealer-listings');
            container.html('');
            container.json2html(data, Templates.orderPage.packages, {append:true});
        }
    },

    //Uncomment this

//    loadVas : function(data){
//        console.log(data);
//        var container = $('.section-box .vas');
//        container.html('');
//        container.json2html(data, Templates.orderPage.vas, {append:true});
//
////        var headHolder = $('.section-box .cleaning .list-head');
////        headHolder.html('');
////        headHolder.json2html(data, Templates.orderPage.cleaning.cleaning_group_head, {append:true});
////        var bodyHolder = $('.section-box .cleaning .list-body');
////        bodyHolder.html('');
////        bodyHolder.json2html(data, Templates.orderPage.cleaning.cleaning_group_body, {append:true});
//
//
////        container.append(json2html.transform(data,Templates.orderPage.services));
//        $.each(data, function(idx, val){
//
//        });
//    },
//    loadVasDetails : function(data){
//        console.log('cleaning details',data);
//        if(data && data.length){
//            var common_data = {};
//            var common_keys = ["type_service", "parts_list", "wa_wb_present"];
//            $.each(common_keys, function(idx, val){
//                common_data[val] = data[0][val]
//            });
//            $('.section-select-holder').hide();
//            $('.dealer-select-holder').show();
//            var container = $('.dealer-box .dealer-listings');
//            container.html('');
//            container.json2html(data, Templates.orderPage.packages_vas, {append:true});
//        }
//    },
    //loadVas : function(data){
    //    console.log(data);
    //},
    paneScrolls:function(){

    },
    generateCarSelect : function(){
        var _this = this;
        var modalCarContent = '<form class="search-set-holder" id="popup-search-set-holder">'+
                '<div class="citybox-holder" id="popup-citybox-holder">'+
                    '<input type="text" id="city-search-box" class="city-search-box" readonly="true" value="delhi">'+
                    '<i class="icon fa fa-caret-down"></i>'+
                    '<label for="city-search-box" class="city-drop-box" style="display: none;">'+
                        '<ul>'+
                            '<li>delhi</li>'+
                            '<li>gurgaon</li>'+
                        '</ul>'+
                    '</label>'+
                '</div>'+
                '<div class="omnibox-holder" id="popup-omnibox-holder">'+
                    '<input type="hidden" id="hidden-id-box" name="c_id" style="display: none;" />'+
                    '<input type="text" id="omni-search-box" class="omni-search-box" placeholder="Select Your Car" autocomplete="off">'+
                    '<i class="icon fa fa-search"></i>'+
                    '<label for="omni-search-box" class="omni-drop-box" style="display: none;">'+
                        '<ul>'+
                        '</ul>'+
                    '</label>'+
                '</div>'+
                '<div class="submit-btn-holder purple-btn-1" id="order-submit-holder">'+
                    '<button class="form-submit-btn" type="submit">Get Started</button>'+
                '</div>'+
            '</form>';
        $('.order-body').append(_this.genericModal(modalCarContent, false));
        var cityBoxHolder = $('#popup-citybox-holder');
        if(cityBoxHolder.length){
            $(cityBoxHolder).materialDropDown({
                input:".city-search-box",
                dropdown:".city-drop-box"
            });
        }
        var omniBoxHolder = $('#popup-omnibox-holder');
        if(omniBoxHolder.length){
            $(omniBoxHolder).materialAutoSuggest({
                input:".omni-search-box",
                dropdown:".omni-drop-box",
                data:_this.carData
            });
        }
        $('.modal-content').addClass('search-box-modal');
        var w = $('.modal-content').width();
        var h = $('.modal-content').height();
        $('.modal-content').css({
            'top': ($(window).innerHeight() - h)/2,
            'left':($(window).innerWidth() - w)/2
        });
        $('#popup-search-set-holder').on('submit', function(){
            var c_id = $(this).find('#hidden-id-box').val();
            var c_name = $(this).find('#omni-search-box').val();
            if (!c_id.length){
                return false
            }else{
                var loc = window.location.href;
                loc = loc.split('.in/')[0]+'.in/';
                local.clearKey('clgacart');
                local.save('clgacarid',c_id);
                local.save('clgacarname',c_name);
                window.location = loc + 'order/?c_id='+c_id;
                return false;
            }

        });

    },
    generateServiceDetailForm : function(serviceObj){
        var _this = this;

        var modalCarContent = '<div class="form-wrapper" id="dealer-pick-form">' +
                'Currently Unable to process this form. Please select add to cart'+
                '<div class="form-row additional">' +
                    '<div class="form-col label-col"><div class="label-div">Additional Queries</div></div>' +
                    '<div class="form-col inp-col-1"></div>' +
                    '<div class="form-col inp-col-2"></div>' +
                '</div>' +
                '<div class="form-row additional">' +
                    '<div class="form-col label-col"><div class="label-div">Custom Requests</div></div>' +
                    '<div class="form-col inp-col-double"><div class="clean-inp-wrapper"><textarea class="clean-inp-tabox pick-addr" type="" rows="3"></textarea></div></div>' +
                '</div>';
        if(serviceObj.dealer == 'Authorized'){
           modalCarContent+= '<div class="separator"></div>'+
                '<div class="form-row ">' +
                '<div class="form-col label-col"><div class>Select dealer:</div></div>'+
                '<div class="form-col inp-col-1"><div class="clean-inp-wrapper"><input type="radio" name="dealer-group-by" value="region">By Region</div></div>' +
                '<div class="form-col inp-col-2"><div class="clean-inp-wrapper"><input type="radio" name="dealer-group-by" value="dealer">By Dealer</div></div>' +
                '</div>' +
                '<div class="form-row dealer-grouped">' +
                    '<div class="form-col">' +
                        '<div class="label-div">Dealer</div>'+
                        '<div class="clean-inp-wrapper">'+
                            '<label class="clean-sbox-wrapper">'+
                            '<select class="clean-inp-sbox dealer-name">'+
                            '</select>'+
                            '</label>'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-col">' +
                        '<div class="label-div">Address</div>'+
                        '<div class="clean-inp-wrapper">'+
                            '<label class="clean-sbox-wrapper">'+
                            '<select class="clean-inp-sbox dealer-address">'+
                            '</select>'+
                            '</label>'+
                        '</div>'+
                    '</div>'+
                 '</div>' +
                '<div class="form-row region-grouped">' +
                    '<div class="form-col">' +
                        '<div class="label-div">Pick City</div>'+
                        '<div class="clean-inp-wrapper">'+
                            '<label class="clean-sbox-wrapper">'+
                            '<select class="clean-inp-sbox dealer-city">'+
                            '</select>'+
                            '</label>'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-col">' +
                        '<div class="label-div">Pick Region</div>'+
                        '<div class="clean-inp-wrapper">'+
                            '<label class="clean-sbox-wrapper">'+
                            '<select class="clean-inp-sbox dealer-region">'+
                            '</select>'+
                            '</label>'+
                        '</div>'+
                    '</div>'+
                    '<div class="form-col">' +
                        '<div class="label-div">Pick Dealer</div>'+
                        '<div class="clean-inp-wrapper">'+
                            '<label class="clean-sbox-wrapper">'+
                            '<select class="clean-inp-sbox dealer-name-address">'+
                            '</select>'+
                            '</label>'+
                        '</div>'+
                    '</div>'+
                '</div>';
           }
           modalCarContent += '<div class="form-row" style="text-align: center;"><a class="detail-add-to-cart" href="/cart">Add to Cart</a></div>' +
               '</div>';
        $('.order-body').append(_this.genericModal(modalCarContent, true));
        var addFeat = _this.additionalFeatures['car'];
        if(_this.carSelected['car_bike'].toLowerCase() == 'bike'){
            addFeat = _this.additionalFeatures['bike'];
        }
        $.each(addFeat, function(i,v){
            var num = (i%2)+1;
            $('.modal-content').find('.form-row.additional').eq(0).find('.inp-col-'+num).append('<div class="clean-inp-wrapper"><input class="clean-inp-cbox" id="pick-drop-toggle" checked type="checkbox"><div class="label-div">'+v+'</div><div>');
        });
        if(serviceObj.dealer == 'Authorized'){

            var brand = _this.carSelected['make'];
            $.each(_this.dealerAddressObj[brand], function(i,v){
                var city = v['city'];
                var name = v['name'];
                var region = v['region'];
                if(city){
                    if(!_this.dealerAddressObj['activeRegionGrouped'][city]){
                        _this.dealerAddressObj['activeRegionGrouped'][city] = {};
                    }
                    if(region){
                        if(!_this.dealerAddressObj['activeRegionGrouped'][city][region]){
                            _this.dealerAddressObj['activeRegionGrouped'][city][region] = [];
                        }
                        _this.dealerAddressObj['activeRegionGrouped'][city][region].push({'address':v['address'],'name':v['name']});
                    }
                }
                if(name){
                    if(!_this.dealerAddressObj['activeDealerGrouped'][name]){
                        _this.dealerAddressObj['activeDealerGrouped'][name] = [];
                    }
                    _this.dealerAddressObj['activeDealerGrouped'][name].push({'address':v['address'],'name':v['name']});
                }
            });
            $.each(Object.keys(Global.dealerAddressObj.activeDealerGrouped), function(i,v){
                $('.modal-content').find('.form-row.dealer-grouped').eq(0).find('select.dealer-name').append('<option value="'+v+'">'+v+'</option>');
            });
            $.each(Object.keys(Global.dealerAddressObj.activeRegionGrouped), function(i,v){
                $('.modal-content').find('.form-row.region-grouped').eq(0).find('select.dealer-city').append('<option value="'+v+'">'+v+'</option>');
            });
        }
        $('.modal-content').addClass('extra-form-modal').attr('data-name', serviceObj.dealer).attr('data-id', serviceObj.s_id);
        var w = $('.modal-content').width();
        var h = $('.modal-content').height();
        $('.modal-content').css({
            'top': ($(window).innerHeight() - h)/2,
            'left':($(window).innerWidth() - w)/2
        });
        $('.modal-content').find('.detail-add-to-cart').on('click', function(e){
            var data_id = $(this).closest('.modal-content').attr('data-id');
            $('.dealer-box').find('.dealer-list-item[data-id="'+data_id+'"]').find('.dealer-add-to-cart').click();
        });
        $('#popup-search-set-holder').on('submit', function(){
            var c_id = $(this).find('#hidden-id-box').val();
            var c_name = $(this).find('#omni-search-box').val();
            if (!c_id.length){
                return false
            }else{
                var loc = window.location.href;
                loc = loc.split('.in/')[0]+'.in/';
                local.clearKey('clgacart');
                local.save('clgacarid',c_id);
                local.save('clgacarname',c_name);
                window.location = loc + 'order/?c_id='+c_id;
                return false;
            }

        });


        if(serviceObj.dealer == 'Authorized'){
            $('#dealer-pick-form').on('change', 'input[name="dealer-group-by"]',function(e){
                    var val = $(this).val();
                if(val == 'dealer'){
                    $('#dealer-pick-form').find('.form-row.region-grouped').hide();
                    $('#dealer-pick-form').find('.form-row.dealer-grouped').show();
                }else if(val == 'region'){
                    $('#dealer-pick-form').find('.form-row.region-grouped').show();
                    $('#dealer-pick-form').find('.form-row.dealer-grouped').hide();
                }

            });
            $('#dealer-pick-form').find('.form-row.dealer-grouped').on('change', 'select.dealer-name',function(e){
                var val = $(this).val();
                        $('.modal-content').find('.form-row.dealer-grouped').eq(0).find('select.dealer-address').html('');

                if(Global.dealerAddressObj.activeDealerGrouped[val]){
                    $.each(Global.dealerAddressObj.activeDealerGrouped[val], function(ix,vl){
                        $('.modal-content').find('.form-row.dealer-grouped').eq(0).find('select.dealer-address').append('<option value="'+vl['address']+'">'+vl['address']+'</option>');
                    });
                }
            });
            $('#dealer-pick-form').find('.form-row.region-grouped').on('change', 'select.dealer-city',function(e){
                var val = $(this).val();
                        $('.modal-content').find('.form-row.region-grouped').eq(0).find('select.dealer-region').html('');
                if(Global.dealerAddressObj.activeRegionGrouped[val]){
                    $.each(Global.dealerAddressObj.activeRegionGrouped[val], function(ix,vl){
                        $('.modal-content').find('.form-row.region-grouped').eq(0).find('select.dealer-region').append('<option value="'+ix+'">'+ix+'</option>');
                    });
                }
               $('.modal-content').find('.form-row.region-grouped').eq(0).find('select.dealer-region').trigger('change');
            });
            $('#dealer-pick-form').find('.form-row.region-grouped').on('change', 'select.dealer-region',function(e){
                var val = $(this).val();
                var val2 = $(this).closest('.form-row').find('.dealer-city').val();
                        $('.modal-content').find('.form-row.region-grouped').eq(0).find('select.dealer-name-address').html('');
                if(Global.dealerAddressObj.activeRegionGrouped[val2] && Global.dealerAddressObj.activeRegionGrouped[val2][val]){
                    $.each(Global.dealerAddressObj.activeRegionGrouped[val2][val], function(ix,vl){
                        $('.modal-content').find('.form-row.region-grouped').eq(0).find('select.dealer-name-address').append('<option value="'+vl['address']+'">'+vl['address']+'</option>');
                    });
                }
            });
            $('#dealer-pick-form').find('select.dealer-name').trigger('change');
            $('#dealer-pick-form').find('select.dealer-city').trigger('change');
        }
    },
    genericModal : function(popupHTML, closeFlag){
        var scrn_ht = $(window).innerHeight();
        var scrn_wd = $(window).innerWidth();
        var _body = $(document).find('.order-body');
        _body.find('.modal-container').remove();
        var container = $("<div></div>").addClass('modal-container');
        var overlay = $("<div></div>").addClass('modal-overlay');
        var content = $("<div></div>").addClass('modal-content').append('<i class="fa fa-times-circle"></i>');
        container.css({
            height : scrn_ht,
            width : scrn_wd
        });
        content.html(popupHTML);
        container.append(overlay).append(content);
        if(closeFlag){
         container.find('.modal-content').append('<i class="close-btn fa fa-close"></i>');
       }
        return container;
    },
    carData:null,
    dealerAddressObj : {
        'activeDealerGrouped':{},
        'activeRegionGrouped':{}
    },
    additionalFeatures : {
        car : ['Clutch Overhaul', 'Interior Dry-cleaning', 'Brake Repair', 'Wheel Balancing', 'Wheel Alignment', 'AC Servicing', 'Injector Cleaning'],
        bike : ['Front Brake Repair',  'Rear Brake repair', 'Wheel Balancing', 'Wheel Alignment']
    },
    redirectToCart : function(){

    }
};

var workflowState = {
    step : null,
    init : function(){
        var _this = this;
        var already_set = window.location.hash;
        console.log(already_set)
        if(already_set == '#_=_'){
            already_set = null
            window.location.hash = ''

        }
        if(!already_set || (already_set && $.inArray(already_set,["service","dealer"]) ) ){
            var data = _this.getWorkflow();
            console.log(data)
            _this.setWorkflow(data.state, data, '#'+data.state);
            _this.pushToHistory(data.state);
            _this.workflowBarUpdate(data.state);
        }else{

        }
        window.onpopstate = function(event){
            var hash = document.location.hash;
            var state = hash.split('?')[0];
            var params = {}

            if(hash.split('?')[1]){
                $.each(hash.split('?')[1].split('&'), function(i, pStr){
                    params[pStr.split('=')[0]] = pStr.split('=')[1];
                });
            }
            if(state == '#service'){
//                _this.setWorkflow(data.state, data, '#'+data.state);
//                _this.pushToHistory(data.state);
                _this.workflowBarUpdate('service');
                $('.dealer-select-holder').hide();
                $('.section-select-holder').show();

            }else if(state == '#dealer'){
                _this.workflowBarUpdate('dealer');
                if(params['s_id']){
                    console.log(params['s_id']);
                    $('.section-listings').find('.service-list-item[data-id="'+params['s_id']+'"]').eq(0).find('.state-update').click();
                }
            }
            console.log('event', event);
            console.log('loc', document.location, document.location.hash);
            console.log(window.history.length);
        }
    },
    pushToHistory: function(state, data, url){
        data = typeof(data) == 'object' ? data: {};
        data.state = state;

        history.pushState(data, null, url);
        return this;
    },
    setWorkflow: function(state, data, url){
            data = typeof(data) == 'object' ? data: {};
            data.state = state;
            history.replaceState(data, null, url);
            return this;
    },
    getWorkflow: function (){
        var returnLocation = history.location || document.location;
        var data = history.state;
        if (!data){
            data = {};
            var _state = returnLocation.hash;
            console.log(_state)
            if (_state.length > 1){
                data = { state: _state.split('#')[1].split('?')[0] };
//                data = $.extend(data, getparams(url));
            }else{
                data = this.defaultState;
            }
        }
        this.step = data;
        return data;
    },
    workflowBarUpdate : function(state){
        var numberState = 0;
        var mapState = {
            'car' : 0,
            'service':1,
            'dealer':2,
            'appointment':3,
            'payment':4
        };
        if(state && mapState[state]){
            numberState = mapState[state]
        }
        var wfc = $('.workflow-holder');
        wfc.find('.marker').removeClass().addClass('marker mark-'+numberState);
        wfc.find('.completion').removeClass().addClass('completion complete-'+numberState);
        wfc.find('.milestone').removeClass('completed');
//        alert('p');
        for(var i=0; i<numberState; i++){
            wfc.find('.mile'+i).addClass('completed');
        }
    },
    defaultState: {
        state: 'service'
    }
};


$(document).ready(function(){
    Global.init();
});


