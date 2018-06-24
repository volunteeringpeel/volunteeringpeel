import update from 'immutability-helper'; // tslint:disable-line:import-name
import * as _ from 'lodash';
import * as React from 'react';
import {
  Button,
  Form,
  SemanticShorthandItem,
  Table,
  TableProps,
  TableRowProps,
} from 'semantic-ui-react';

interface FancyTableProps<T> {
  filters: { name: string; description: string; filter: ((input: T) => boolean) }[];
  tableData: T[];
  headerRow: (string | { name: Renderable; key: string; function?: (row: T) => any })[];
  renderBodyRow: (data: T, i: number) => TableRowProps;
}

interface FancyTableState<T> {
  filters: { [name: string]: number };
  hidden: Set<number>;
  sortCol: string;
  sortDir: 'ascending' | 'descending';
}

export default class FancyTable<T> extends React.Component<
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
  }

  public handleSort = (i: string) => () => {
    const { sortCol, sortDir } = this.state;

    if (i !== sortCol) {
      this.setState({
        sortCol: i,
        sortDir: 'ascending',
      });

      return;
    }

    this.setState({
      sortDir: sortDir === 'ascending' ? 'descending' : 'ascending',
    });
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

    const sortCol = _.find(
      this.props.headerRow,
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

    const processedData = _.orderBy(filteredData, sortPredicate, [sortDir]);

    return (
      <>
        <Form.Field inline>
          <label>Columns:</label>
          <Button.Group
            buttons={_.map(this.props.headerRow, (header, i) => {
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
            _.filter(this.props.headerRow, (__, i) => !this.state.hidden.has(i)),
            (header, i) => {
              const sortColumn = typeof header === 'string' ? header : header.key;
              return (
                <Table.HeaderCell
                  key={i}
                  content={typeof header === 'string' ? header : header.name}
                  sorted={this.state.sortCol === sortColumn ? this.state.sortDir : null}
                  onClick={this.handleSort(sortColumn)}
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
