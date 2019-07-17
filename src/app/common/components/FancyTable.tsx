import update, { Spec } from 'immutability-helper'; // tslint:disable-line:import-name
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, Table, TableProps, TableRowProps } from 'semantic-ui-react';

import AsyncComponent from '@app/common/AsyncComponent';

interface FancyTableProps<T> {
  filters: { name: string; description: string; filter: ((input: T) => boolean) | object }[];
  tableData: T[];
  columnDefs: (string | ColumnDefinition<T>)[];
  renderBodyRow: (data: T, i: number) => TableRowProps;
  filterCallback?: (filters: any[]) => any;
  sortCallback?: (key: string, dir: 'ascending' | 'descending') => any;
}

// Schema-defining column
interface ColumnDefinition<T> {
  name: Renderable;
  key: string; // sorting key
  function?: (row: T) => any; // sorting function
  hide?: boolean; // hide column by default
}

interface FancyTableState<T> {
  filters: { [name: string]: number };
  hidden: Set<number>;
  sortCol: string;
  sortDir: 'ascending' | 'descending';
}

export default class FancyTable<T> extends AsyncComponent<
  // allow table props to get passed through
  FancyTableProps<T> & TableProps,
  FancyTableState<T>
> {
  constructor(props: FancyTableProps<T>) {
    super(props);

    this.state = {
      filters: {},
      hidden: new Set(),
      sortCol: null,
      sortDir: 'ascending',
    };

    this.handleSort = this.handleSort.bind(this);
    this.handleFilter = this.handleFilter.bind(this);

    _.map(this.props.columnDefs, (header, i) => {
      if (typeof header !== 'string' && header.hide) this.state.hidden.add(i);
    });
  }

  public handleSort = async (key: string) => {
    // ignore if null key
    if (key === null) return;

    // update state
    const { sortCol, sortDir } = this.state;
    let nextDir: 'ascending' | 'descending' = 'ascending';
    if (key === sortCol) {
      nextDir = sortDir === 'ascending' ? 'descending' : 'ascending';
    }
    await this.setState({ sortCol: key, sortDir: nextDir });

    // handle callback
    if (this.props.sortCallback) {
      // find header entry
      const header = _.find(
        this.props.columnDefs,
        row => key === (typeof row === 'string' ? row : row.key),
      );
      // parse header entry
      const callbackKey = typeof header === 'string' ? _.snakeCase(header) : header.key;

      this.props.sortCallback(callbackKey, nextDir);
    }
  };

  public handleFilter = async (name: string) => {
    await this.setState(
      update(this.state, {
        filters: {
          [name]: {
            $set: this.state.filters[name] === 1 ? -1 : this.state.filters[name] === -1 ? 0 : 1,
          },
        },
      }),
    );

    if (this.props.filterCallback) {
      const filters: any[] = [];
      _.forEach(this.props.filters, f => {
        if (this.state.filters[f.name] === 1) filters.push(f.filter);
        if (this.state.filters[f.name] === -1) filters.push({ $not: f.filter });
      });
      this.props.filterCallback(filters);
    }
  };

  public render() {
    let processedData = this.props.tableData;
    // only use client-side filtering if no server-side filtering
    if (!this.props.filterCallback) {
      // find filters which are turned on
      const activeFilters = _.filter(
        this.props.filters,
        filter => this.state.filters[filter.name] === 1,
      );
      const excludeFilters = _.filter(
        this.props.filters,
        filter => this.state.filters[filter.name] === -1,
      );
      // apply the filters
      const filteredData = _.reduce(
        excludeFilters,
        // negative filters (stupid type hack included)
        (acc, filter) => _.filter(acc, __ => !(filter as any).filter(__)),
        _.reduce(
          activeFilters,
          // positive filters
          (acc, filter) => _.filter(acc, filter.filter),
          processedData,
        ),
      );
      // overwrite processedData with filtered data
      processedData = filteredData;
    }
    // only use client-side sorting if no server-side sorting
    if (!this.props.sortCallback) {
      const sortCol = _.find(
        this.props.columnDefs,
        row => this.state.sortCol === (typeof row === 'string' ? row : row.key),
      );
      const sortPredicate = [];
      // handle shorthand sort parameter someColumn -> some_column
      if (typeof sortCol === 'string') {
        sortPredicate.push(_.snakeCase(this.state.sortCol));
      } else if (sortCol) {
        // complex parameter where key is passed directly or handler function is passed
        sortPredicate.push(sortCol.function ? sortCol.function : sortCol.key);
      }

      // ascending -> asc, descending -> desc
      const sortDir = this.state.sortDir.substr(0, this.state.sortDir.indexOf('c') + 1) as
        | 'asc'
        | 'desc';
      // overwrite processedData with sorted data
      processedData = _.orderBy(processedData, sortPredicate, [sortDir]);
    }

    return (
      <>
        <Form.Field inline>
          <label>Columns:</label>
          <Button.Group
            buttons={_.map(this.props.columnDefs, (header, i) => {
              const hidden = this.state.hidden.has(i);
              const operation = { [hidden ? '$remove' : '$add']: [i] };
              return {
                key: i,
                content: typeof header === 'string' ? header : header.name,
                positive: !hidden,
                onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.setState(
                    update(this.state, {
                      hidden: operation as { [x in '$remove' | '$add']: number[] },
                    }),
                  );
                },
              };
            })}
          />
        </Form.Field>
        <Form.Field inline>
          <label>Filters:</label>
          <Button.Group
            buttons={_.map(this.props.filters, filter => ({
              key: filter.name,
              content: filter.description,
              positive: this.state.filters[filter.name] === 1,
              negative: this.state.filters[filter.name] === -1,
              // function generates function
              onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleFilter(filter.name);
              },
            }))}
          />
        </Form.Field>
        <Table
          {...this.props}
          tableData={processedData}
          compact
          celled
          sortable
          headerRow={_.map(
            _.filter(this.props.columnDefs, (__, i) => !this.state.hidden.has(i)),
            (header, i) => {
              const sortColumn = typeof header === 'string' ? header : header.key;
              return (
                <Table.HeaderCell
                  key={i}
                  content={typeof header === 'string' ? header : header.name}
                  sorted={this.state.sortCol === sortColumn ? this.state.sortDir : null}
                  onClick={() => this.handleSort(sortColumn)}
                />
              );
            },
          )}
          renderBodyRow={(data, i) => {
            const row = this.props.renderBodyRow(data, i);
            return { ...row, cells: _.filter(row.cells, (__, ix) => !this.state.hidden.has(+ix)) };
          }}
        />
      </>
    );
  }
}
