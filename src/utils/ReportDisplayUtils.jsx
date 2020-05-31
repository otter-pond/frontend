import React from "react";

export const formatDate = (date) => {
    try{
        return new Date(date).toLocaleDateString();
    } catch(e) {
        console.log("Unable to format date")
        return "Invalid Date"
    }
}

export const formatValue = (valueType, value) => {
    if (valueType != null) {
        if (valueType === "financial") {
            let fixed = value.toFixed(2);
            if (value < 0) {
                return "-$" + Math.abs(fixed)
            }
            return "$" + fixed;
        }
    }
    return value;
}

export const formatDescription = (description) => {
    let formattedDescriptions = []
    let splitDescriptions = description.split("\n");
    for (let index in splitDescriptions) {
        let descriptionString = splitDescriptions[index];
        let splitDescription = descriptionString.split("\t");
        if (splitDescription.length > 1) {
            let temp = "<span style='font-weight: bold'>" + splitDescription[0] + " </span> " + splitDescription[1];
            formattedDescriptions[index] = temp
        } else {
            formattedDescriptions[index] =  splitDescription[0];
        }
    }

    let descriptionHtml = formattedDescriptions.join("<br />");
    return <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
}

export const summarizeEntries = (entries, valueType) => {
    var summary = ""
    if (valueType === "optionselect") {
        var summaryObj = {}
        entries.forEach(entry => {
            if (summaryObj.hasOwnProperty(entry["value"])) {
                summaryObj[entry["value"]] = summaryObj[entry["value"]] + 1
            } else {
                summaryObj[entry["value"]] = 1;
            }
        })
        summary = <span>
                {Object.keys(summaryObj).map((name, key) => {
                    return <span key={key}>{name}: {summaryObj[name]}<br /></span>
                })}
            </span>
    } else {
        var total = 0;
        entries.forEach(entry => {
            total += parseFloat(entry["value"]);
        });
        if (valueType === "financial") {
            total = total.toFixed(2);
            if (total > 0) {
                summary = <span>Total: ${total}</span>
            } else {
                summary = <span>Total: -${Math.abs(total)}</span>
            }
        } else {
            summary = <span>Total: {total}</span>
        }
    }

    return summary
}