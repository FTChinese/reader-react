import { UrlBuilder } from './request'

it('new url builder', () => {
  expect(new UrlBuilder('/hello-world').toString())
    .toEqual('/hello-world')
});

it('url with query', () => {
  const url = new UrlBuilder('/hello-world')
    .setLive(true)
    .toString();

  expect(url).toEqual('/hello-world?live=true');
});

