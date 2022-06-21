import { ApiErrorPayload, ResponseError } from './response-error';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

const noBodyMethods: Array<HttpMethod> = ['GET', 'HEAD'];

export class Fetch {

  private method: HttpMethod = 'GET';
  private url: string = '';
  private headers: Headers = new Headers();
  private body?: BodyInit;

  get(url: string): Fetch {
    this.method = 'GET';
    this.url = url;
    return this;
  }

  post(url: string): Fetch {
    this.method = 'POST';
    this.url = url;
    return this;
  }

  put(url: string): Fetch {
    this.method = 'PUT';
    this.url = url;
    return this;
  }

  patch(url: string): Fetch {
    this.method = 'PATCH';
    this.url = url;
    return this;
  }

  delete(url: string): Fetch {
    this.method = 'DELETE';
    this.url = url;
    return this;
  }

  setHeader(key: string, value: string): Fetch {
    this.headers.set(key, value);
    return this;
  }

  appendHeader(key: string, value: string): Fetch {
    this.headers.append(key, value);
    return this;
  }

  setBeaderAuth(token: string): Fetch {
    this.headers.set('Authorization', `Bearer ${token}`);

    return this;
  }

  acceptLang(value: string): Fetch {
    this.headers.append('Accept-Language', value);
    return this;
  }

  contentJson(): Fetch {
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
    return this;
  }

  sendJson<T>(value: T): Fetch {
    if (noBodyMethods.includes(this.method)) {
      return this;
    }

    this.body = JSON.stringify(value);
    return this;
  }

  end(): Promise<Response> {
    const request = new Request(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body,
    });

    return fetch(request)
  }

  endOrReject(): Promise<Response> {
    return this.end()
      .then(response => {
        if (response.status < 400) {
          return response;
        }

        return response.json()
          .then((payload: ApiErrorPayload) =>{
            return Promise.reject(new ResponseError(
              response.status,
              payload
            ));
          });
      });
  }

  endJson<T>(): Promise<T> {
    return this.endOrReject()
      .then(response => {
        return response.json();
      });
  }
}

export class UrlBuilder {
  private url: URL;
  private paths: string[];

  constructor(base: string) {
    this.url = new URL(base);
    this.paths = [];
  }

  appendPath(segment: string): UrlBuilder {
    this.paths.push(segment);
    return this;
  }

  appendQuery(key: string, value: string): UrlBuilder {
    this.url.searchParams.append(key, value);
    return this;
  }

  setQuery(key: string, value: string): UrlBuilder {
    this.url.searchParams.set(key, value);
    return this;
  }

  setSearchParams(params: URLSearchParams): UrlBuilder {
    for (const [key, value] of params) {
      this.url.searchParams.set(key, value);
    }
    return this;
  }

  toString(): string {
    if (this.paths.length > 0) {
      this.url.pathname = this.paths.join('/');
    }
    return this.url.toString();
  }
}
