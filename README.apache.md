Inlcuded in here is a basic idea of how URL's should be re-written for the tdtrac
software.  If you have a .htaccess file in the directory in which tdtrac is 
installed in, the software assumes that you want rewritten URLs.

Basically, any request in the directory that tdtrac is installed in, if a 
physical file or directory does not exist for it, should be redirected to
the index, with the query string of action=[page requested].

    RewriteEngine on

    RewriteBase /
 
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule (.+) /index.php?action=$1 [L] 
