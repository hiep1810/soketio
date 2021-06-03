var toggle = 0;

var containerUser = document.getElementById('users');
var containerGroup = document.getElementById('groups');

//display none;
containerGroup.style.display = 'none';

var btnUsers = document.getElementById('btn-users');
var btnGroups = document.getElementById('btn-groups');

btnUsers.addEventListener('click', function () {
  containerUser.style.display = 'block';
  containerGroup.style.display = 'none';
});

btnGroups.addEventListener('click', function () {
  containerGroup.style.display = 'block';
  containerUser.style.display = 'none';
});
