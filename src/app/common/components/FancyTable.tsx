import update from 'immutability-helper'; // tslint:disable-line:import-name
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, Table, TableProps, TableRowProps } from 'semantic-ui-react';

interface FancyTableProps<T> {
  filters: { name: string; description: string; filter: ((input: T) => boolean) }[];
  tableData: T[];
  columnDefs: (string | ColumnDefinition<T>)[];
  renderBodyRow: (data: T, i: number) => TableRowProps;
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

export default class FancyTable<T> extends React.Component<
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

    _.map(this.props.columnDefs, (header, i) => {
      if (typeof header !== 'string' && header.hide) this.state.hidden.add(i);
    });
  }

  public handleSort = (key: string) => {
    // ignore if null key
    if (key === null) return;

    // update state
    const { sortCol, sortDir } = this.state;
    let nextDir: 'ascending' | 'descending' = 'ascending';
    if (key === sortCol) {
      nextDir = sortDir === 'ascending' ? 'descending' : 'ascending';
    }
    this.setState({ sortCol: key, sortDir: nextDir });

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

  public render() {
    const updateFilter = (filter: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      this.setState(
        update(this.state, {
          filters: {
            [filter]: {
              $set:
                this.state.filters[filter] === 1 ? -1 : this.state.filters[filter] === -1 ? 0 : 1,
            },
          },
        }),
      );
    };

    const activeFilters = _.filter(
      this.props.filters,
      filter => this.state.filters[filter.name] === 1,
    );
    const excludeFilters = _.filter(
      this.props.filters,
      filter => this.state.filters[filter.name] === -1,
    );

    const filteredData = _.reduce(
      excludeFilters,
      (acc, filter) => _.filter(acc, __ => !filter.filter(__)),
      _.reduce(activeFilters, (acc, filter) => _.filter(acc, filter.filter), this.props.tableData),
    );

    let processedData = filteredData;
    if (!this.props.sortCallback) {
      const sortCol = _.find(
        this.props.columnDefs,
        row => this.state.sortCol === (typeof row === 'string' ? row : row.key),
      );
      const sortPredicate = [];
      if (typeof sortCol === 'string') {
        sortPredicate.push(_.snakeCase(this.state.sortCol));
      } else if (sortCol) {
        sortPredicate.push(sortCol.function ? sortCol.function : sortCol.key);
      }

      // ascending -> asc, descending -> desc
      const sortDir = this.state.sortDir.substr(0, this.state.sortDir.indexOf('c') + 1);

      processedData = _.orderBy(filteredData, sortPredicate, [sortDir]);
    }

    return (
      <>
        <Form.Field inline>
          <label>Columns:</label>
          <Button.Group
            buttons={_.map(this.props.columnDefs, (header, i) => {
              const hidden = this.state.hidden.has(i);
              return {
                key: i,
                content: typeof header === 'string' ? header : header.name,
                positive: !hidden,
                onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  this.setState(
                    update(this.state, {
                      hidden: {
                        [hidden ? '$remove' : '$add']: [i],
                      },
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
              onClick: updateFilter(filter.name),
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
