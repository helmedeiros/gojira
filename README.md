# gojira

Series of tasks to extract Jira data.


## Installation

Clone the repository:
<pre>git clone git@github.com:helmedeiros/gojira.git</pre>

Install dependencies:
<pre>npm install</pre>

GoJira!:
<pre>node index.js</pre>


## Project configuration

In order to extract the stories you want a minimum configuration is needed. To change this information, please refer to the file:<br />
<b>project_config.json</b>

<br />

<b>control_chart</b>: Your project control chart. You can find it on the Report Tab of the Scrum board. <i>(Required)</i>.<br />
<b>project_key</b>: Your project key in Jira (DEMO, RIS3, etc) <i>(Required)</i>.<br />
<b>component</b>: Your component <i>(Not required)</i>.<br />
<b>work_group</b>: Should be Application. You can try Infra for example <i>(Not required)</i>.<br />
<b>max_results</b>: It will default to 300 for performance reasons. You can increment/decrement if needed.<br />
<b>output_csv_path</b>: Where to save the generated CSV so you can open in excel and create all your wonderful charts.<br />
<b>points_per_day</b>: The factor to use to calculate projected lead time for stories. Default is 1.25 (meaning a pair can finish a 4-point story in a 2-week sprint).<br />

## Testing

Install jasmine-node:
<pre>npm install jasmine-node -g</pre>

Run unit tests:
<pre>jasmine-node spec</pre>
