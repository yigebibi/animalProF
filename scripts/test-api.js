const http = require('http');

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function test() {
  // 1. Register
  console.log('\n=== 1. POST /auth/register ===');
  const reg = await request({
    hostname: 'localhost', port: 3000,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, JSON.stringify({ username: 'apitest05', email: 'apitest05@test.com', password: 'test123456' }));
  console.log(JSON.stringify(reg, null, 2));
  const token = reg.data?.access_token;
  const headers = { 'Authorization': `Bearer ${token}` };

  // 2. Get profile
  console.log('\n=== 2. GET /users/profile ===');
  const profile = await request({ hostname: 'localhost', port: 3000, path: '/api/v1/users/profile', method: 'GET', headers }, null);
  console.log(JSON.stringify(profile, null, 2));

  // 3. Update profile
  console.log('\n=== 3. PUT /users/profile ===');
  const updated = await request({
    hostname: 'localhost', port: 3000, path: '/api/v1/users/profile',
    method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' }
  }, JSON.stringify({ nickname: '測試用戶', bio: 'API測試' }));
  console.log(JSON.stringify(updated, null, 2));

  // 4. Get posts
  console.log('\n=== 4. GET /posts ===');
  const posts = await request({ hostname: 'localhost', port: 3000, path: '/api/v1/posts?page=1&limit=5', method: 'GET' }, null);
  console.log(JSON.stringify(posts, null, 2));

  // 5. Create post
  console.log('\n=== 5. POST /posts ===');
  const newPost = await request({
    hostname: 'localhost', port: 3000, path: '/api/v1/posts',
    method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }
  }, JSON.stringify({ title: 'API測試帖子', content: '這是通過API創建的帖子', category: 'share', tags: ['測試', 'API'] }));
  console.log(JSON.stringify(newPost, null, 2));
  const postId = newPost.data?.id;

  // 6. Get post detail
  if (postId) {
    console.log(`\n=== 6. GET /posts/${postId} ===`);
    const postDetail = await request({ hostname: 'localhost', port: 3000, path: `/api/v1/posts/${postId}`, method: 'GET', headers }, null);
    console.log(JSON.stringify(postDetail, null, 2));
  }

  // 7. Create comment
  if (postId) {
    console.log(`\n=== 7. POST /comments ===`);
    const comment = await request({
      hostname: 'localhost', port: 3000, path: '/api/v1/comments',
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }
    }, JSON.stringify({ postId, content: '這是API測試評論' }));
    console.log(JSON.stringify(comment, null, 2));
  }

  // 8. Get pets
  console.log('\n=== 8. GET /pets ===');
  const pets = await request({ hostname: 'localhost', port: 3000, path: '/api/v1/pets', method: 'GET', headers }, null);
  console.log(JSON.stringify(pets, null, 2));

  // 9. Create pet
  console.log('\n=== 9. POST /pets ===');
  const newPet = await request({
    hostname: 'localhost', port: 3000, path: '/api/v1/pets',
    method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' }
  }, JSON.stringify({ name: '小白', type: '狗', breed: '金毛', gender: 1 }));
  console.log(JSON.stringify(newPet, null, 2));

  // 10. Like post
  if (postId) {
    console.log(`\n=== 10. POST /posts/${postId}/like ===`);
    const like = await request({
      hostname: 'localhost', port: 3000, path: `/api/v1/posts/${postId}/like`,
      method: 'POST', headers
    }, null);
    console.log(JSON.stringify(like, null, 2));
  }

  // 11. Search
  console.log('\n=== 11. GET /search?q=API ===');
  const search = await request({ hostname: 'localhost', port: 3000, path: '/api/v1/search?q=API', method: 'GET' }, null);
  console.log(JSON.stringify(search, null, 2));

  console.log('\n=== 測試完成 ===');
}

test().catch(console.error);
