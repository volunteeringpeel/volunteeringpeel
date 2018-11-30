import axios, { AxiosError } from 'axios';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, Card, CardProps, Form } from 'semantic-ui-react';

interface ImagesProps {
  addMessage: (message: VP.Message) => any;
}

interface ImagesState {
  images: string[];
  upload: File;
}

export default class Images extends React.Component<ImagesProps, ImagesState> {
  constructor(props: ImagesProps) {
    super(props);

    this.state = {
      images: [],
      upload: null,
    };

    this.handleUpload = this.handleUpload.bind(this);
  }

  public componentDidMount() {
    this.refresh();
  }

  public refresh() {
    axios
      .get(`/api/header-image`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
      })
      .then(res => this.setState({ images: res.data.data }))
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      });
  }

  public handleUpload() {
    const data = new FormData();
    data.append('header', this.state.upload);
    Bluebird.resolve(
      axios.post(`/api/header-image`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
      }),
    )
      .then(res => {
        this.props.addMessage({
          message: res.data.data,
          severity: 'positive',
        });
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => {
        this.refresh();
      });
  }

  public handleDelete = (filename: string) => () => {
    Bluebird.resolve(
      axios.delete(`/api/header-image/${filename}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('id_token')}` },
      }),
    )
      .then(res => {
        this.props.addMessage({
          message: res.data.data,
          severity: 'positive',
        });
      })
      .catch((error: AxiosError) => {
        this.props.addMessage({
          message: error.response.data.error,
          more: error.response.data.details,
          severity: 'negative',
        });
      })
      .finally(() => {
        this.refresh();
      });
  };

  public render() {
    return (
      <Card.Group
        items={_.concat(
          _.map(this.state.images, (image): CardProps => ({
            image: '/upload/header/' + image,
            extra: <Button negative basic content="Delete" onClick={this.handleDelete(image)} />,
            key: image,
          })),
          [
            {
              header: 'Upload new image',
              description: (
                <Form.Input
                  type="file"
                  label="Select image: "
                  onChange={({ target }: React.FormEvent<HTMLInputElement>) =>
                    this.setState({ upload: (target as HTMLInputElement).files[0] })
                  }
                />
              ),
              extra: <Button positive basic content="Upload" onClick={this.handleUpload} />,
              key: 'upload',
            },
          ],
        )}
      />
    );
  }
}
