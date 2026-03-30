import _ from 'lodash'

const getIntoData = ({
    fields = [],
    object = {}
}) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
const unGetSelectData = (unselect = []) => {
    return Object.fromEntries(unselect.map(el => [el, 0]))
}
const filterFieldToUpdate = (payload) => {
    if (payload === null || payload === undefined) {
        return undefined
    }

    if (Array.isArray(payload)) {
        return payload
            .map(filterFieldToUpdate)
            .filter(item => item !== undefined)
    }

    if (typeof payload === "object") {
        const filtered = Object.fromEntries(
            Object.entries(payload)
                .map(([key, value]) => [key, filterFieldToUpdate(value)])
                .filter(([_, value]) => value !== undefined)
        )

        return Object.keys(filtered).length ? filtered : undefined
    }
    return payload
}
const flattenObject = (obj, prefix = "") => {
    let result = {}

    for (const key in obj) {
        const value = obj[key]
        const newKey = prefix ? `${prefix}.${key}` : key

        if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value)
        ) {
            Object.assign(result, flattenObject(value, newKey))
        } else {
            result[newKey] = value
        }
    }

    return result
}
export {
    getIntoData,
    getSelectData,
    unGetSelectData,
    filterFieldToUpdate,
    flattenObject
}