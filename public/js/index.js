$(document).ready(function(){
    $('#error_message_binary').hide();
    $('#error_message_hex').hide();

    $('#nav_tab').click(function(e) {

        $('.nav li.active').removeClass('active');

        var $parent = $(this).parent();
        $parent.addClass('active');
        e.preventDefault();
    });

    $('#form_binary').submit(async function(){
        var formInfo = {
            Signbit: $('#input_sb').val(),
            CombinationField: $('#input_cf').val(),
            ExponentContinuation: $('#input_ec').val(),
            CoefficientContinuation1: $('#input_cc1').val(),
            CoefficientContinuation2: $('#input_cc2').val()
        }
        /*
            INPUT CHECKING
            Signbit must be 1 bit
            CombinationField must be 5 bits
            ExponentContinuation must be 6 bits
            CoefficientContinuation1 must be 10 bits
            CoefficientContinuation2 must be 10 bits
        */
        if(formInfo.Signbit.length != 1 || formInfo.CombinationField.length != 5 || formInfo.ExponentContinuation.length != 6 || 
            formInfo.CoefficientContinuation1.length != 10 || formInfo.CoefficientContinuation2.length != 10){
            $('#error_message_binary').show();
            $('#error_message_binary').text("Please input properly!")
        }
        else{
            $('#error_message_binary').hide();
            /* Infinity if Combination Field is equal to 11110 - Special case*/
            if(formInfo.CombinationField == "11110"){
                $('#output').text("Infinity");
            }
            /* NaN if Combination Field is equal to 11111 - Special case*/
            else if(formInfo.CombinationField == "11111"){
                $('#output').text("NaN");
            }
            /* Solve for Floating point*/
            else{
                formInfo.Signbit = parseInt(formInfo.Signbit);
                formInfo.CombinationField = parseInt(formInfo.CombinationField);
                formInfo.ExponentContinuation = parseInt(formInfo.ExponentContinuation);
                formInfo.CoefficientContinuation1 = parseInt(formInfo.CoefficientContinuation1);
                formInfo.CoefficientContinuation2 = parseInt(formInfo.CoefficientContinuation2);

                var msd, exp, coefcont1, coefcont2, final;

                if(Math.floor(formInfo.CombinationField / 1000) == 11){
                    msd = parseInt((1000 + formInfo.CombinationField % 10), 2) * 1000000;
                    exp = parseInt((Math.floor(Math.floor(formInfo.CombinationField % 1000) / 10) * 1000000 + formInfo.ExponentContinuation),2) - 101;
                    coefcont1 = getDecPackedBCD(formInfo.CoefficientContinuation1) * 1000;
                    coefcont2 = getDecPackedBCD(formInfo.CoefficientContinuation2);
                    final = msd + coefcont1 + coefcont2;
                    // console.log(msd);
                    // console.log(exp);
                    // console.log(coefcont1 / 1000);
                    // console.log(coefcont2);
                }
                else{
                    msd = parseInt((formInfo.CombinationField % 1000), 2) * 1000000;
                    exp = parseInt((Math.floor(formInfo.CombinationField / 1000) * 1000000 + formInfo.ExponentContinuation), 2) - 101;
                    coefcont1 = getDecPackedBCD(formInfo.CoefficientContinuation1) * 1000;
                    coefcont2 = getDecPackedBCD(formInfo.CoefficientContinuation2);
                    final = msd + coefcont1 + coefcont2;
                    // console.log(msd);
                    // console.log(exp);
                    // console.log(coefcont1 / 1000);
                    // console.log(coefcont2);
                }

                if(formInfo.Signbit == 1){
                    final = final * -1;
                }

                if(coefcont1 == 0 && coefcont2 == 0){
                    final = final / 1000000;
                }
                else if(coefcont2 == 0){
                    final = final / 1000;
                }
                $('#output').text((final.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " x 10 ^ " + exp);
                $('#output').val((final.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " x 10 ^ " + exp);
            }
        }
        
    });

    $('#form_hex').submit(async function(){
        var hex = $('#input_hex').val();
        var atemp = [];
        var formInfo = {
            Signbit: "",
            CombinationField: "",
            ExponentContinuation: "",
            CoefficientContinuation1: "",
            CoefficientContinuation2: ""
        }
        if(hex.length != 8){
            $('#error_message_hex').show();
            $('#error_message_hex').text("Please input properly!")
        }
        else{
            $('#error_message_hex').hide();
            for(let i = 0; i < hex.length; i++){
                atemp[i] = parseInt(hex[i], 16).toString(2);
            }
            // console.log(atemp)
            getBinaryInputs()
        }

        function getBinaryInputs(){
            formInfo.Signbit = Math.floor(atemp[0] / 1000);
            formInfo.CombinationField = ((atemp[0] % 1000) * 100) + Math.floor(atemp[1] / 100);
            formInfo.ExponentContinuation = ((atemp[1] % 100) * 10000) + Math.floor(atemp[2]);
            formInfo.CoefficientContinuation1 = ((atemp[3] * 1000000)) + (atemp[4] * 100) + Math.floor(atemp[5] / 100);
            formInfo.CoefficientContinuation2 = ((atemp[5] % 100) * 100000000) + (atemp[6] * 10000) + Math.floor(atemp[7]);

            /* Infinity if Combination Field is equal to 11110 - Special case*/
            if(formInfo.CombinationField == "11110"){
                $('#output').text("Infinity");
            }
            /* NaN if Combination Field is equal to 11111 - Special case*/
            else if(formInfo.CombinationField == "11111"){
                $('#output').text("NaN");
            }
            /* Solve for Floating point*/
            else{
                formInfo.Signbit = parseInt(formInfo.Signbit);
                formInfo.CombinationField = parseInt(formInfo.CombinationField);
                formInfo.ExponentContinuation = parseInt(formInfo.ExponentContinuation);
                formInfo.CoefficientContinuation1 = parseInt(formInfo.CoefficientContinuation1);
                formInfo.CoefficientContinuation2 = parseInt(formInfo.CoefficientContinuation2);

                var msd, exp, coefcont1, coefcont2, final;

                if(Math.floor(formInfo.CombinationField / 1000) == 11){
                    msd = parseInt((1000 + formInfo.CombinationField % 10), 2) * 1000000;
                    exp = parseInt((Math.floor(Math.floor(formInfo.CombinationField % 1000) / 10) * 1000000 + formInfo.ExponentContinuation),2) - 101;
                    coefcont1 = getDecPackedBCD(formInfo.CoefficientContinuation1) * 1000;
                    coefcont2 = getDecPackedBCD(formInfo.CoefficientContinuation2);
                    final = msd + coefcont1 + coefcont2;
                    // console.log(msd);
                    // console.log(exp);
                    // console.log(coefcont1 / 1000);
                    // console.log(coefcont2);
                }
                else{
                    msd = parseInt((formInfo.CombinationField % 1000), 2) * 1000000;
                    exp = parseInt((Math.floor(formInfo.CombinationField / 1000) * 1000000 + formInfo.ExponentContinuation), 2) - 101;
                    coefcont1 = getDecPackedBCD(formInfo.CoefficientContinuation1) * 1000;
                    coefcont2 = getDecPackedBCD(formInfo.CoefficientContinuation2);
                    final = msd + coefcont1 + coefcont2;
                }

                if(formInfo.Signbit == 1){
                    final = final * -1;
                }

                if(coefcont1 == 0 && coefcont2 == 0){
                    final = final / 1000000;
                }
                else if(coefcont2 == 0){
                    final = final / 1000;
                }
                $('#output').text((final.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " x 10 ^ " + exp);
                $('#output').val((final.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " x 10 ^ " + exp);
            }
        }
    });

    function getDecPackedBCD(bcd){
        var dig1, dig2, dig3, final = 0;
        if(Math.floor((bcd % 10000) / 1000) == 1){
            if(Math.floor((bcd % 1000)/10) == 0){
                dig1 = parseInt(Math.floor(bcd / 10000000), 2);
                dig2 = parseInt((Math.floor(bcd / 10000) % 1000), 2);
                dig3 = 8 + parseInt(Math.floor(bcd % 1000), 2);
            }
            else if(Math.floor((bcd % 1000)/10) == 01){
                dig1 = parseInt(Math.floor(bcd / 10000000), 2);
                dig2 = 8 + parseInt((Math.floor(bcd / 10000) % 10), 2);
                dig3 = parseInt((Math.floor((Math.floor(bcd / 10000) % 1000) / 10) * 10) + Math.floor(bcd % 10), 2)

            }
            else if(Math.floor((bcd % 1000)/10) == 10){
                dig1 = 8 + parseInt((Math.floor(bcd / 10000000) % 10), 2);
                dig2 = parseInt((Math.floor(bcd / 10000) % 1000), 2);
                dig3 = parseInt(Math.floor(bcd / 100000000) * 10 + Math.floor(bcd % 10), 2);
            }
            else if(Math.floor((bcd % 1000)/10) == 11){
                if(Math.floor((Math.floor(bcd / 10000) % 1000)/10) == 0){
                    dig1 = 8 + parseInt((Math.floor(bcd / 10000000) % 10), 2);
                    dig2 = 8 + parseInt((Math.floor(bcd / 10000) % 10), 2);
                    dig3 = parseInt(Math.floor(bcd / 100000000) * 10 + Math.floor(bcd % 10), 2)
                }
                else if(Math.floor((Math.floor(bcd / 10000) % 1000)/10) == 01){
                    dig1 = 8 + parseInt((Math.floor(bcd / 10000000) % 10), 2);
                    dig2 = parseInt(((Math.floor(bcd / 10000000) / 10) * 10 + Math.floor(bcd / 10000) % 10), 2);
                    dig3 = 8 + parseInt(Math.floor(bcd % 1000) % 10);
                }
                else if(Math.floor((Math.floor(bcd / 10000) % 1000)/10) == 10){
                    dig1 = parseInt(Math.floor(bcd / 10000000), 2);
                    dig2 = 8 + parseInt((Math.floor(bcd / 10000) % 10), 2);
                    dig3 = 8 + parseInt(Math.floor(bcd % 1000) % 10);
                }
                else if(Math.floor((Math.floor(bcd / 10000) % 1000)/10) == 11){
                    dig1 = 8 + parseInt((Math.floor(bcd / 10000000) % 10), 2);
                    dig2 = 8 + parseInt((Math.floor(bcd / 10000) % 10), 2);
                    dig3 = 8 + parseInt(Math.floor(bcd % 1000) % 10);
                }
            }
            final = (dig1 * 100) + (dig2 * 10) + dig3;
        }
        else{
            dig1 = parseInt(Math.floor(bcd / 10000000), 2);
            dig2 = parseInt((Math.floor(bcd / 10000) % 1000), 2);
            dig3 = parseInt(Math.floor(bcd % 1000), 2);
            final = (dig1 * 100) + (dig2 * 10) + dig3;
        }
        return final; 
    }

    /* Disabling inputs that is not equal to 1 or 0 */
    document.getElementById('input_sb').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1 && e.key != "Backspace"){
            e.preventDefault();
        };
    });
    document.getElementById('input_cf').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1 && e.key != "Backspace"){
            e.preventDefault();
        };
    });
    document.getElementById('input_ec').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1 && e.key != "Backspace"){
            e.preventDefault();
        };
    })
    document.getElementById('input_cc1').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1 && e.key != "Backspace"){
            e.preventDefault();
        };
    })
    document.getElementById('input_cc2').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1 && e.key != "Backspace"){
            e.preventDefault();
        };
    })
    document.getElementById('input_hex').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1 && e.key != "Backspace" && e.key != 2 && e.key != 3 && e.key != 4 && e.key != 5 && e.key != 6 && e.key != 7 && e.key != 8 && e.key != 9
        && e.key != "A" && e.key != "B" && e.key != "C" && e.key != "D" && e.key != "E" && e.key != "F" ){
            e.preventDefault();
        };
    })

})