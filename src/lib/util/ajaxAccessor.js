export {
    getAsync,
    post
};

function getAsync(url, dataHandler, failedHandler) {
    if (isEmpty(url)) {
        return;
    }

    $.ajax({
            type: "GET",
            url: url,
            cache: false,
            xhrFields: {
                withCredentials: true
            }
        })
        .done((data) => {
            if (dataHandler !== undefined) {
                dataHandler(data);
            }
        })
        .fail((res, textStatus, errorThrown) => {
            if (failedHandler !== undefined) {
                failedHandler();
            }
        });
}

function post(url, data, successHandler, failHandler, finishHandler) {
    if (isEmpty(url)) {
        return;
    }

    console.log("POST data", data);

    $.ajax({
            type: "post",
            url: url,
            contentType: "application/json",
            data: data,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        })
        .done(successHandler)
        .fail(failHandler)
        .always(finishHandler);
}

function isEmpty(str) {
    return !str || str === "";
}
