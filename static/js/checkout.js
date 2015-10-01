/**
 * Created with PyCharm.
 * User: aragorn
 * Date: 26/08/15
 * Time: 2:47 AM
 * To change this template use File | Settings | File Templates.
 */

var zyxCart = {
    init : function(){
        var _this = this;
        _this.eventHandlers();
        _this.setLogos();
    $('#date-time-pair .pick-up-time').timepicker({
//        'showDuration': true,
//        timeFormat: 'hh:mm p',
        // year, month, day and seconds are not important
        minTime: new Date(0, 0, 0, 9, 0, 0),
        maxTime: new Date(0, 0, 0, 16, 0, 0),
        // items in the dropdown are separated by at interval minutes
        interval: 30,
    });

    $('#date-time-pair .pick-up-date').datepicker({
        'format': 'm/d/yyyy',
//        'autoclose': true,
        'minDate': new Date()
    });
        local.clearKey('clgacart');

    // initialize datepair
//    var basicExampleEl = document.getElementById('date-time-pair');
//    var datepair = new Datepair(basicExampleEl);

    },
    setLogos : function(){
        $.each($('img.dealer-logo'), function(i, img){
            var dealer = $(img).attr('alt');
            var carMake = $(img).attr('data-name');
            console.log(dealer)
            if(dealer == 'Authorized'){
                $(img).attr('src', logoMap['Authorized']+ $.trim(carMake)+'.jpg');
            }else{
                $(img).attr('src', logoMap[dealer]);
//                $(img).attr('src', )
            }
        });
    },
    setLayout : function(){

    },
    loadStep  : function(){

    },
    eventHandlers : function(){
        var _this = this;
        $('.login-step .change-login-btn').on('click', function(){
            //summarize previous steps
            //set present
            $('.login-step').find('.completed-summary,.min-header').addClass('none-i');
            $('.login-step').find('.max-content').removeClass('none-i');
            //minimize forward steps
            $('.address-step,.confirm-step,.payment-step').find('.max-content,.completed-summary').addClass('none-i');
            $('.address-step,.confirm-step,.payment-step').find('.min-header').removeClass('none-i');
        });
        $('.login-step .continue-btn').on('click', function(){
            //summarize previous steps
            $('.login-step').find('.max-content,.min-header').addClass('none-i');
            $('.login-step').find('.completed-summary').removeClass('none-i');
            //set present
            $('.address-step').find('.completed-summary,.min-header').addClass('none-i');
            $('.address-step').find('.max-content').removeClass('none-i');
            //minimize forward steps
            $('.confirm-step,.payment-step').find('.max-content,.completed-summary').addClass('none-i');
            $('.confirm-step,.payment-step').find('.min-header').removeClass('none-i');
        });
        $('.address-step .change-address-btn').on('click', function(){
            //summarize previous steps
//            $('.login-step').find('.completed-summary,.min-header').addClass('none-i');
//            $('.login-step').find('.max-content').removeClass('none-i');
            //set present
            $('.address-step').find('.completed-summary,.min-header').addClass('none-i');
            $('.address-step').find('.max-content').removeClass('none-i');
            //minimize forward steps
            $('.confirm-step,.payment-step').find('.max-content,.completed-summary').addClass('none-i');
            $('.confirm-step,.payment-step').find('.min-header').removeClass('none-i');
        });
        $('.address-step .continue-btn').on('click', function(){
            if(formCheck.addressForm($('.address-form-holder'))){
                //summarize previous steps
                $('.login-step').find('.max-content,.min-header').addClass('none-i');
                $('.login-step').find('.completed-summary').removeClass('none-i');
                $('.address-step').find('.max-content,.min-header').addClass('none-i');
                $('.address-step').find('.completed-summary').removeClass('none-i');
                //set present
                $('.confirm-step').find('.completed-summary,.min-header').addClass('none-i');
                $('.confirm-step').find('.max-content').removeClass('none-i');
                //minimize forward steps
                $('.payment-step').find('.max-content,.completed-summary').addClass('none-i');
                $('.payment-step').find('.min-header').removeClass('none-i');

                var dataObj = formCheck.getSelectedAddress($('.address-form-holder'));
                var formDispCont = $('.address-step .completed-summary .info');
                zyxCart.orderObj = dataObj;
                console.log($(formDispCont));
                console.log(dataObj);
                $(formDispCont).find('.name').text(dataObj.name);
                $(formDispCont).find('.number').text(dataObj.number);
                $(formDispCont).find('.st-address').text(dataObj.pick.street);
                $(formDispCont).find('.pincode').text(dataObj.pick.pincode);
                $(formDispCont).find('.city').text(dataObj.pick.city);


            }
        });

        $('.address-step').on('keydown', '.error', formCheck.clearErrorEvent);

        $('.address-step #pick-up-col').on('focusout', 'textarea,input,select', function(){
            var check = $('#pick-drop-toggle').prop('checked');
            if(check){
                var this_cls = $(this).attr('class').split(' ')[1];
                if(this_cls){
                    var that_cls = this_cls.replace('pick', 'drop');
                    var val = $(this).val();
                    $('#drop-off-col').find('.'+that_cls).val(val);
                }
            }else{

            }
        });

        $('.add-address-btn').on('click', function(){

        });

        $('.address-form-holder #pick-drop-toggle').on('change', function(){
            var val = $(this).prop('checked');
            var form = $(this).closest('.address-form-holder');
            if(val){
                $(form).find('#drop-off-col').addClass('disabled');
                $(form).find('#drop-off-col').find('input,textarea').attr('disabled', true);
            }else{
                $(form).find('#drop-off-col').removeClass('disabled');
                $(form).find('#drop-off-col').find('input,textarea').removeAttr('disabled');
            }
        })

        $('.confirm-step #place-order-btn').on('click', function(){
            var orderObj = {};
            if(zyxCart.orderObj){
                orderObj = zyxCart.orderObj;
            }else{
                orderObj = formCheck.getSelectedAddress($('.address-form-holder'));
            }

            orderObj['pick'] = JSON.stringify(orderObj['pick']);
            orderObj['drop'] = JSON.stringify(orderObj['drop']);
            var trarray = $('.confirm-step .table-holder table tbody').find('tr');
            var arry = [];
            $.each(trarray, function(ix, tr){
                var orderItem = {};
                orderItem['ts'] = $(tr).attr('ts');
                orderItem['service'] = $(tr).attr('service');
                orderItem['service_id'] = $(tr).attr('id');
                arry.push(orderItem);
//                arry.push(JSON.stringify(orderItem));
            });
            orderObj['order_list'] = JSON.stringify(arry);
            orderObj['car_id'] = $('.confirm-step .table-holder table').attr('data-id');
            orderObj['car_name'] = $('.confirm-step .table-holder table').attr('data-name');
//            console.log('')
            Commons.ajaxData('place_order', orderObj,"GET", _this, _this.onOrderPlace);

        });

    },
    onOrderPlace : function(){
        console.log('[')
                $('.login-step').find('.max-content,.min-header').addClass('none-i');
                $('.login-step').find('.completed-summary').removeClass('none-i');
                $('.address-step').find('.max-content,.min-header').addClass('none-i');
                $('.address-step').find('.completed-summary').removeClass('none-i');
                $('.confirm-step').find('.max-content,.min-header').addClass('none-i');
                $('.confirm-step').find('.completed-summary').removeClass('none-i');
                //set present
                $('.payment-step').find('.completed-summary,.min-header').addClass('none-i');
                $('.payment-step').find('.max-content').removeClass('none-i');
                //minimize forward steps
//                $('.payment-step').find('.max-content,.completed-summary').addClass('none-i');
//                $('.payment-step').find('.min-header').removeClass('none-i');
                $('.login-step').find('.change-login-btn').off('click').hide();
                $('.address-step').find('.change-address-btn').off('click').hide();
    }

};

$(document).ready(function(){
    zyxCart.init();
});
