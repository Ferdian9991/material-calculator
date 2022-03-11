"use strict";

const numberFormatter = new Intl.NumberFormat('id-ID');

const resizeWindow = () => {
    const resultPanel = $(window).height() - $(".input").height() - $("#clear-scr").height();

    $('.h-screen').css('height', $(window).height());
    $(".panel-screen").css('height', resultPanel);
}

resizeWindow();

window.addEventListener('resize', function () {
    resizeWindow();
}, true);

const ops = ['+', '-', '*', '/', '=', '×', '<', '>', '<=', '>=', '&', '|', '^', '(', ')'];
const regexp = new RegExp(
    ops.map(function (op) { return '\\' + op; }).join('|'));

let dispatchOperation = '';

const resultFlip = (condition) => {
    if (!condition) {
        $("#result").css({
            'font-size': '30px',
            'transition': 'font-size 0.3s !important',
            'line-height': '35px;'
        })
        $("#result").removeClass('text-dark').addClass('text-muted')
        $("#value").css({
            'font-size': '50px',
            'transition': 'font-size 0.3s'
        })
        $("#value").removeClass('text-muted').addClass('text-dark')
    } else {
        $("#value").css('font-size', '30px')
        $("#value").removeClass('text-dark').addClass('text-muted')
        $("#result").css({
            'font-size': '50px',
            'line-height': '55px'
        })
        $("#result").removeClass('text-muted').addClass('text-dark')
    }
    return condition;
}

const autoMath = (e) => {
    const getValue = $(e).find('p').text();
    resultFlip(false);
    const mathString = $("#value").text().replace(/×/g, '*');
    if ($("#value").text()) {
        $("#result").show();
        if (regexp.test(dispatchOperation)) {
            try {
                const result = eval(mathString);
                $("#result").text("= " + result);
            } catch (e) {
                return true;
            }
        } else {
            $("#result").text(eval(`${$("#value").text()}`));
        }
    } else {
        $("#result").text('');
    }
}

$("#result").hide();
$(".num").on('click', function () {
    const getValue = $(this).find('p').text();
    $("#value").append(getValue);
    autoMath(this);
})

$(".clear").on('click', function () {
    $("#value").text("");
    autoMath();
})

$(".operation").on('click', function () {
    resultFlip(false);
    const getOperation = $(this).find('p').data('value');
    const oldValue = $("#value").text();
    const lastChar = $("#value").text().substr(oldValue.length - 1);
    const operationSymbol = ['+', '-', '/', '×']
        .includes(lastChar);
    switch (getOperation) {
        case 'del':
            $("#value").text(oldValue.slice(0, -1));
            autoMath();
            break;
        case 'result':
            try {
                resultFlip(true);
            } catch (e) {
                $("#value").text(oldValue.slice(0, -1));
            }
            break;
        default:
            if (!operationSymbol) {
                $("#value").append(getOperation);
            } else if (!lastChar.includes(getOperation)) {
                $("#value").text(oldValue.slice(0, -1) + getOperation);
            }
            dispatchOperation = getOperation;
    }
})