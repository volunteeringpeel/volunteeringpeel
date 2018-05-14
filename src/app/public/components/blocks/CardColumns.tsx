import * as _ from 'lodash';
import * as React from 'react';
import { Card, Grid, SemanticWIDTHS } from 'semantic-ui-react';

interface CardColumnsProps {
  cards: Renderable[];
  columns: number & SemanticWIDTHS;
}

export default class CardColumns extends React.Component<CardColumnsProps> {
  public render() {
    return (
      <Grid stackable columns={this.props.columns}>
        <Grid.Row>
          {_.times(this.props.columns, i => {
            const start = Math.floor(i * this.props.cards.length / this.props.columns);
            const end = Math.floor((i + 1) * this.props.cards.length / this.props.columns);
            return (
              <Grid.Column>
                <Card.Group children={this.props.cards.slice(start, end)} />
              </Grid.Column>
            );
          })}
        </Grid.Row>
      </Grid>
    );
  }
}
