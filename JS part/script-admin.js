const postTweet = async (tweet) => {
  const responseTweet = await fetch(`http://localhost:3000/approvePost`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa(username + ':' + password)
                    },
                    body: JSON.stringify({
                        content: tweet
                    })
                });
                if (!responseTweet.ok) {
                  throw new Error('Twiter response was not ok');
              }
              console.log('Tweeted successfully')
}


const username = 'yo.livy';
const password = '1234';

const adminDesk = document.getElementById('admin-desk');
const getCheck = async () => {

    const headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
    
    const requestOptions = {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'default'
    };
  
    const url = 'http://127.0.0.1:8000/postcards/check';
  
    try {
      const response = await fetch(url, requestOptions);
      const checkData = await response.json();
      console.log(checkData);
      checkData.forEach(function(post) {
        var postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = '<h2>' + post.title + '</h2>' + '<p>' + post.content + '</p>' + '<p>' + post.author + '</p>';

        var btn = document.createElement('button');
        btn.innerHTML = post.is_approved ? 'Disapprove' : 'Approve';
        btn.onclick = async function() {
            post.is_approved = !post.is_approved;
            btn.innerHTML = post.is_approved ? 'Disapprove' : 'Approve';
            postDiv.className = post.is_approved ? 'post-approved' : 'post';

            // Send update to your database
            try {
                const response = await fetch(`http://127.0.0.1:8000/postcards/${post.id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + btoa(username + ':' + password)
                    },
                    body: JSON.stringify({
                        title: post.title,
                        content: post.content,
                        author: post.author,
                        tag: post.tag,
                        is_approved: post.is_approved
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                console.log('Post status updated successfully');
                console.log('Start tweet');
                postTweet(post.content);
                console.log('Finish tweet');

            } catch (error) {
                console.log('Failed to update post status: ', error);
            }
        };

        postDiv.appendChild(btn);
        document.getElementById('admin-desk').appendChild(postDiv);
    });
    } catch (error) {
      console.error(error);
    }
  };
  
getCheck();