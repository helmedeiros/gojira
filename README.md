gojira
=========

Series of tasks to extract Jira data.


Installation
============

Clone the repository:
<pre>git clone git@github.com:helmedeiros/gojira.git</pre>

Install dependencies:
<pre>npm install</pre>

GoJira!:
<pre>node index.js</pre>

Project configuration
=====================

In order to extract the stories you want a minimum configuration is needed. To change this information, please refer to the file:
<pre>project_config.json</pre>

'project_key': Your project key in Jira (DEMO, RIS3, etc) - (Required).
'component': Your component (Not required).
'work_group': Should be Application. You can try Infra for example (Not required).
'max_results': It' using 300 for performance reasons. You can increment if missing stories.

Testing
=======

Install jasmine-node:
<pre>npm install jasmine-node -g</pre>

Run unit tests:
<pre>jasmine-node spec</pre>
