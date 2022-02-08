const Page = require('./helpers/page');

let blogsPage;

// beforeEach(async () => {
//   blogsPage = await Page.build();
//   await blogsPage.goto('localhost:3000');
// });

describe('When logged in', async () => {
  beforeEach(async () => {
    blogsPage = await Page.build();
    await blogsPage.goto('http://localhost:3000');
    await blogsPage.login();
    await blogsPage.click('a.btn-floating');
  });

  afterEach(async () => {
    if (blogsPage) {
      await blogsPage.close();
    }
  });

  test('can see blog create form', async () => {
    const label = await blogsPage.getContentsOf('form label');
  
    expect(label).toEqual('Blog Title');
  });

  describe('And using valid inputs', async () => {
    beforeEach(async () => {
      await blogsPage.type('.title input', 'My Title');
      await blogsPage.type('.content input', 'My Content');
      await blogsPage.click('form button');
    });

    test('Submitting takes user to review screen', async () => {
      await blogsPage.waitFor('h5');
      const text = await blogsPage.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    test('Submitting then saving ads blog to the index blogsPage', async () => {
      await blogsPage.click('button.green');
      await blogsPage.waitFor('.card');

      const title = await blogsPage.getContentsOf('.card-title');
      const content = await blogsPage.getContentsOf('p');

      expect(title).toEqual('My Title');
      expect(content).toEqual('My Content');
    });
  });

  describe('And using invalid inputs', async () => {
    beforeEach(async () => {
      await blogsPage.click('form button');
    });
    
    test('the form shows an error message', async () => {
      const titleError = await blogsPage.getContentsOf('.title .red-text');
      const contentError = await blogsPage.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

// describe('User is not logged in', async () => {
//   const actions = [
//     {
//       method: 'get',
//       path: '/api/blogs'
//     }, 
//     // {
//     //   method: 'post',
//     //   path: '/api/blogs',
//     //   data: { title: 'T', content: 'C' }
//     // }
//   ];
//   // test('User cannot create blog posts', async () => {
//   //   const result = await blogsPage.post('/api/blogs', { title: 'T', content: 'C' });

//   //   expect(result).toEqual({ error: 'You must log in!' });
//   // });

//   // test('User cannot get a list of posts', async () => {
//   //   const result = await blogsPage.get('/api/blogs');

//   //   expect(result).toEqual({ error: 'You must log in!' });
//   // });

//   test('Blog related actions are prohibited', async () => {
//     const results = await blogsPage.execRequests(actions);

//     for (let result of results) {
//       expect(result).toEqual({ error: 'You must log in!' });
//     }
//   });
// });