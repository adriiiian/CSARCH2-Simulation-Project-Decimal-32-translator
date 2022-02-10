$(document).ready(function(){
    $('#error_message').hide();

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
            console.log(formInfo.CoefficientContinuation1.length)
            $('#error_message').show();
            $('#error_message').text("Please input properly!")
        }
        else{
            $('#error_message').hide();
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

                var msd, exp;

                if(Math.floor(formInfo.CombinationField / 1000) == 11){
                    msd = parseInt((1000 + formInfo.CombinationField % 10), 2);
                    exp = parseInt((Math.floor(Math.floor(formInfo.CombinationField % 1000) / 10) * 1000000 + formInfo.ExponentContinuation),2) - 101;
                    console.log("msd: " + msd);
                    console.log("exp: " + exp);
                }
                else{
                    console.log("not 11")
                    console.log(formInfo.CombinationField / 1000)
                }
                $('#output').text('Hello')
            }
        }

        
    });

    /* Disabling inputs that is not equal to 1 or 0 */
    document.getElementById('input_sb').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1){
            e.preventDefault();
        };
    });
    document.getElementById('input_cf').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1){
            e.preventDefault();
        };
    });
    document.getElementById('input_ec').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1){
            e.preventDefault();
        };
    })
    document.getElementById('input_cc1').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1){
            e.preventDefault();
        };
    })
    document.getElementById('input_cc2').addEventListener('keydown', function(e){
        if(e.key != 0 && e.key != 1){
            e.preventDefault();
        };
    })

})