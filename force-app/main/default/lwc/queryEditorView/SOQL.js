export default class SOQL {

    fromText;
    fieldList = [];
    numberOfRows;
    conditions = [];
    sortCondition = {};

    constructor(sobject) {
        this.fromText = sobject;
        this.fieldList = [];
        this.conditions = [];
    }

    select = (fields) => {
        this.fieldList = fields;
        return this;
    };

    setLimit = (limit) => {
        this.numberOfRows = limit;
        return this;
    }

    orderBy = (field, sort) => {
        this.sortCondition['field'] = field;
        this.sortCondition['operator'] = sort;
        return this;
    }

    where = (field, operator, value) => {
        let where_object = {};
        where_object['field'] = field;
        where_object['operator'] = operator;
        where_object['value'] = value
        this.conditions.push(where_object);
        return this;
    }


    buildSelect = () => {
        if (this.fieldList.size !== 0) {
            return 'SELECT ' + Array.from(this.fieldList).join(', ');
        } else {
            return 'SELECT Id';
        }
    }

    buildOrderBy = () => {
        if (this.sortCondition['field'] !== null && this.sortCondition['field'] != undefined) {
            return 'ORDER BY ' + this.sortCondition['field'] + ' ' + this.sortCondition['operator'];
        } else {
            return '';
        }
    }

    buildConditions = () => {
        const condList = [];

        this.conditions.map(({ field, operator, value }) => {
            if (operator == 'LIKE1') {
                condList.push(`${field} LIKE '${value}%'`);
            } else if (operator == 'LIKE2') {
                condList.push(`${field} LIKE '%${value}'`);
            } else if (operator == 'LIKE3') {
                condList.push(`${field} LIKE '%${value}%'`);
            } else if (operator == 'IN' || operator == 'NOT IN' || operator == 'INCLUDES' || operator == 'EXCLUDES') {
                condList.push(`${field} ${operator} ('${value}')`);
            } else {
                condList.push(`${field} ${operator} '${value}'`);
            }
        });

        if (this.conditions.length !== 0) {
            return 'WHERE ' + condList.join(' AND ');
        } else {
            return '';
        }
    };

    build = () => {
        const queryParts = [];

        queryParts.push(this.buildSelect());
        queryParts.push('FROM ' + this.fromText);

        if (this.conditions.length !== 0) {
            queryParts.push(this.buildConditions());
        }

        if (this.sortCondition) {
            queryParts.push(this.buildOrderBy())
        }

        if (this.numberOfRows) {
            queryParts.push('LIMIT ' + this.numberOfRows);
        }

        console.log(queryParts);
        return queryParts.join(' ');
    };

}