import getObjectFields from '@salesforce/apex/QueryController.getObjectFields';
import getObjList from '@salesforce/apex/QueryController.getObjList';
import getResults from '@salesforce/apex/QueryController.getResults';
import { LightningElement, track, wire } from 'lwc';
import SOQL from './SOQL'


export default class QueryEditorView extends LightningElement {
    @track fields = [];
    @track fieldLables = [];
    @track sobjList = [];
    @track sObjectFields = [];
    @track selectedObject = '';
    @track sortField;
    @track sortOperator = 'ASC';
    @track limit;
    @track filter;
    @track filterValue;
    @track filterOperation;
    @track query;

    data = [];
    columns = [];

    @wire(getObjList)
    wireSobjectList({ error, data }) {
        if (data) {
            this.sobjList = [];
            for (var key in data) {
                this.sobjList.push({
                    label: data[key],
                    value: key
                });
            }
        } else {
            console.log(error);
        }
    };


    @wire(getObjectFields, { obj: '$selectedObject' })
    wireSObjectFileds({ error, data }) {
        if (data) {
            this.sObjectFields = [];
            for (var key in data) {
                this.sObjectFields.push({
                    label: data[key],
                    value: key
                });
            }
        } else {
            console.log(error);
        }
    };

    get sortOrder() {
        return [
            { label: 'A TO Z', value: 'ASC' },
            { label: 'Z TO A', value: 'DESC' }
        ];
    }

    get filterOperations() {
        return [
            { label: '=', value: '=' },
            { label: '≠', value: '!=' },
            { label: '<', value: '<' },
            { label: '≤', value: '<=' },
            { label: '>', value: '>' },
            { label: '≥', value: '>=' },
            { label: 'starts with', value: 'LIKE1' },
            { label: 'ends with', value: 'LIKE2' },
            { label: 'contains', value: 'LIKE3' },
            { label: 'in', value: 'IN' },
            { label: 'not in', value: 'NOT IN' },
            { label: 'includes', value: 'INCLUDES' },
            { label: 'excludes', value: 'EXCLUDES' }
        ];
    }

    handleObjectSelection(event) {
        this.selectedObject = event.detail.value;
        this.refreshData();
    }

    refreshData() {
        this.fields = ['Id'];
        this.sortField = '';
        this.sortOperator = 'ASC';
        this.limit = '';
        this.filter = '';
        this.filterValue = '';
        this.filterOperation = '';
        this.query = '';
    }

    handleFilterChange(event) {
        this.filter = event.detail.value;
        this.buildQuery();
    }

    filterOperationChange(event) {
        this.filterOperation = event.detail.value;
        this.buildQuery();
    }

    handleFilterValue(event) {
        this.filterValue = event.target.value;
        this.buildQuery();
    }

    handleSortChange(event) {
        this.sortField = event.detail.value;
        this.buildQuery();
    }

    sortOperatorChange(event) {
        this.sortOperator = event.detail.value;
        this.buildQuery();
    }

    handleLimitChange(event) {
        this.limit = parseInt(event.target.value);
        this.buildQuery();
    }


    handleSelection(event) {
        this.fields = event.detail.value;
        this.buildQuery();
        this.createColumns()
    }

    createColumns() {
        this.columns = []
        if (this.fields.size != 0) {
            for (let item in this.fields) {
                var column = {};
                column['label'] = this.fields[item];
                column['fieldName'] = this.fields[item];
                this.columns.push(column)
            }
        }
        console.log(this.columns);

    }

    handleClick(event) {
        event.preventDefault();
        getResults({ query: this.query }).then((result) => {
            this.data = result;
        }).catch((error) => {
            console.log(error);
        });
    }

    buildQuery() {
        var soql = new SOQL(this.selectedObject).select(this.fields).setLimit(this.limit);
        if (this.sortField) {
            soql.orderBy(this.sortField, this.sortOperator)
        }
        if (this.filterOperation && this.filterValue && this.filter) {
            soql.where(this.filter, this.filterOperation, this.filterValue)
        }
        var soqlString = soql.build();
        this.query = soqlString;
        console.log('Query ' + soqlString);
    }
}