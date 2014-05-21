<?php
	$local_root = 'http://' . $_SERVER['SERVER_NAME'];	
	include($_SERVER['DOCUMENT_ROOT'].'/include/common.php');
	$selectedtab = 4;
	include($_SERVER['DOCUMENT_ROOT'].'/template/header.php');
	
	include($_SERVER['DOCUMENT_ROOT'].'/database/grabdata.php');
?>
	<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js"></script>
    <script src="http://hplccolumns.org/database/columnVisualizer.js"></script>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr align="center">
            <td>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding-left:10px; padding-right:10px;">
                    <tr>
                        <td class="heading1" colspan="2">
                            Step #1: Select a Column to Compare
                        </td>
                    </tr>
                    <tr>
                    	<td class="text_main" colspan="2">
                        	<p style="margin-top: 20px; margin-bottom: 0px;">
                            <b>Select a column</b> to compare from the list below. A similarity factor, <i>F<sub>s</sub></i>, will be calculated for each of the other columns in the database (below).
                            </p>
                            <br/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        	<select size=10 id="list_allcolumns" style="width:400px;" onchange="var selectedColID = document.getElementById('list_allcolumns').options[document.getElementById('list_allcolumns').selectedIndex].value;	sorter.calcNewFs(1, selectedColID, 0, 5, 6, 7, 8, 9);">
                            	<?php
									$columns = array();
									$x = 0;
									for ($i = 0; $i <= count($column_data); $i++)
									{
										if ($column_data[$i]["manufacturer"] != '')
										{
											$columns[$x]["id"] = $column_data[$i]["id"];
											$columns[$x]["name"] = $column_data[$i]["manufacturer"].' '.$column_data[$i]["name"];
											$x++;
										}
									}
									
									// Obtain a list of columns
									$manufacturer = array();
									$name = array();
									$id = array();
									
									foreach ($columns as $key => $row) 
									{
										$id[$key] = $row['id'];
										$manufacturer[$key] = $row['manufacturer'];
										$name[$key] = $row['name'];
									}
									
									array_multisort($manufacturer, SORT_ASC, SORT_STRING, $name, SORT_ASC, SORT_STRING, $columns);
									
									// Set first element as selected by default
									echo '<option value="'.$columns[0]["id"].'" selected="selected">'.$columns[0]["manufacturer"].' '.$columns[0]["name"].'</option>';
									
									for ($i = 1; $i <= count($columns); $i++)
									{
										echo '<option value="'.$columns[$i]["id"].'">'.$columns[$i]["manufacturer"].' '.$columns[$i]["name"].'</option>';
									}
								?>
                            </select>
                        </td>
                    </tr>
                    <tr>
                    	<td>
                    		<button style="width:400px;" type="button" onclick="clickFunction()">Visualize Columns</button>
                    	</td>
                    </tr>
                    <tr>
                        <td>
                        <button style="width:400px;" type="button" onclick="helpFunction()">Help</button>
                        </td>
                    </tr>
                </table>
                <br />
                <br />
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding-left:10px; padding-right:10px;">
                    <tr>
                        <td class="heading1" colspan="2">
                            Step #2: Compare to Other Columns
                        </td>
                    </tr>
                    <tr>
                    	<td class="text_main" colspan="2">
                        	<p style="margin-top: 20px; margin-bottom: 0px;">
                            	The <i>F<sub>s</sub></i> factor describes the similarity of two columns. A small <i>F<sub>s</sub></i> indicates that two columns are very similar. A large <i>F<sub>s</sub></i> factor indicates that two columns are very different. <b>To find the columns that are most similar to the one selected above, sort the column database below by <i>F<sub>s</sub></i> so that the smallest <i>F<sub>s</sub></i> values are listed first.</b> To find the columns that are most different from the one selected above, sort the column database below by <i>F<sub>s</sub></i> so that the largest <i>F<sub>s</sub></i> values are listed first. 
                            </p>
                        </td>
                    </tr>
                    <tr>
                    	<td class="text_main" colspan="2">
                        	<p style="margin-top: 20px; margin-bottom: 0px;">
                            Select filters to narrow down the list of stationary phases. <br /><b>To select multiple values</b> within a box, hold down 'Ctrl' while selecting values within the box. <br /><b>To select a range of values</b> within a box, select the starting value in the box, then hold down 'Shift' while selecting the ending value in the box.
                            </p>
                            <!--<p style="margin-top: 10px;">
                            You can also download the database:
                            </p>
                            <p><a href="<?php echo $local_root;?>/database/database.csv"><img src="<?php echo $local_root;?>/images/downloadarrow.png" style="vertical-align: middle; margin-right: 5px; margin-left: 5px;" border="0px"/>database.csv</a>
                            </p>-->
                            <br/>
                        </td>
                    </tr>
                </table>
                <table width="100%" border="0" cellpadding="0" cellspacing="2" class="filter">
                	<thead>
                	<tr>
                    	<th>
                        	Manufacturer
                        </th>
                        <th>
                        	Silica type
                        </th>
                        <th>
                        	<span style="font-family:'Times New Roman', Times, serif">H</span>
                        </th>
                        <th>
                        	<span style="font-family:'Times New Roman', Times, serif">S*</span>
                        </th>
                        <th>
                        	<span style="font-family:'Times New Roman', Times, serif">A</span>
                        </th>
                        <th>
                        	<span style="font-family:'Times New Roman', Times, serif">B</span>
                        </th>
                        <th>
                        	<span style="font-family:'Times New Roman', Times, serif">C</span> (pH 2.8)
                        </th>
                        <th>
                        	<span style="font-family:'Times New Roman', Times, serif">C</span> (pH 7.0)
                        </th>
                        <th>
                        	EB retention factor
                        </th>
                        <th>
                        	USP type
                        </th>
                        <th>
                        	Phase type
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                    	<td width="204px">
                        	<select multiple size=10 id="list_manufacturer" style="width:200px;">
                            	<?php
									foreach ($manufacturer_list as $this_manufacturer)
									{
										echo '<option>'.$this_manufacturer.'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu1 = document.getElementById("list_manufacturer")
								selectmenu1.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu1.options.length; i++)
									{
										if (selectmenu1.options[i].selected)
											filterarray.push(selectmenu1.options[i].text);
									}
								 	sorter.setfilter(3, filterarray, 0);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_manufacturer').selectedIndex = -1; sorter.setfilter(3, []);">remove filter</a>
                        </td>
                    	<td width="84px">
                        	<select multiple size=10 id="list_type" style="width:80px;">
                            	<?php
									foreach ($type_list as $this_type)
									{
										echo '<option>'.$this_type.'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu2 = document.getElementById("list_type")
								selectmenu2.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu2.options.length; i++)
									{
										if (selectmenu2.options[i].selected)
											filterarray.push(selectmenu2.options[i].text);
									}
								 	sorter.setfilter(4, filterarray, 0);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_type').selectedIndex = -1; sorter.setfilter(4, []);">remove filter</a>
                        </td>
                        <td width="104px">
                        	<select multiple size=10 id="list_H" style="width:100px;">
                            	<?php
									for ($i = 0; $i <= count($H_list_string); $i++)
									{
										echo '<option value="'.$H_list_num[$i].'">'.$H_list_string[$i].'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu3 = document.getElementById("list_H")
								selectmenu3.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu3.options.length; i++)
									{
										if (selectmenu3.options[i].selected)
											filterarray.push(selectmenu3.options[i].value);
									}
								 	sorter.setfilter(5, filterarray, 1);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_H').selectedIndex = -1; sorter.setfilter(5, []);">remove filter</a>
                        </td>
                        <td width="104px">
                        	<select multiple size=10 id="list_S" style="width:100px;">
                            	<?php
									for ($i = 0; $i <= count($S_list_string); $i++)
									{
										echo '<option value="'.$S_list_num[$i].'">'.$S_list_string[$i].'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu4 = document.getElementById("list_S")
								selectmenu4.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu4.options.length; i++)
									{
										if (selectmenu4.options[i].selected)
											filterarray.push(selectmenu4.options[i].value);
									}
								 	sorter.setfilter(6, filterarray, 1);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_S').selectedIndex = -1; sorter.setfilter(6, []);">remove filter</a>
                        </td>
                        <td width="104px">
                        	<select multiple size=10 id="list_A" style="width:100px;">
                            	<?php
									for ($i = 0; $i <= count($A_list_string); $i++)
									{
										echo '<option value="'.$A_list_num[$i].'">'.$A_list_string[$i].'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu5 = document.getElementById("list_A")
								selectmenu5.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu5.options.length; i++)
									{
										if (selectmenu5.options[i].selected)
											filterarray.push(selectmenu5.options[i].value);
									}
								 	sorter.setfilter(7, filterarray, 1);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_A').selectedIndex = -1; sorter.setfilter(7, []);">remove filter</a>
                        </td>
                        <td width="104px">
                        	<select multiple size=10 id="list_B" style="width:100px;">
                            	<?php
									for ($i = 0; $i <= count($B_list_string); $i++)
									{
										echo '<option value="'.$B_list_num[$i].'">'.$B_list_string[$i].'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu6 = document.getElementById("list_B")
								selectmenu6.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu6.options.length; i++)
									{
										if (selectmenu6.options[i].selected)
											filterarray.push(selectmenu6.options[i].value);
									}
								 	sorter.setfilter(8, filterarray, 1);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_B').selectedIndex = -1; sorter.setfilter(8, []);">remove filter</a>
                        </td>
                        <td width="104px">
                        	<select multiple size=10 id="list_C28" style="width:100px;">
                            	<?php
									for ($i = 0; $i <= count($C28_list_string); $i++)
									{
										echo '<option value="'.$C28_list_num[$i].'">'.$C28_list_string[$i].'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu7 = document.getElementById("list_C28")
								selectmenu7.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu7.options.length; i++)
									{
										if (selectmenu7.options[i].selected)
											filterarray.push(selectmenu7.options[i].value);
									}
								 	sorter.setfilter(9, filterarray, 1);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_C28').selectedIndex = -1; sorter.setfilter(9, []);">remove filter</a>
                        </td>
                        <td width="104px">
                        	<select multiple size=10 id="list_C70" style="width:100px;">
                            	<?php
									for ($i = 0; $i <= count($C70_list_string); $i++)
									{
										echo '<option value="'.$C70_list_num[$i].'">'.$C70_list_string[$i].'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu8 = document.getElementById("list_C70")
								selectmenu8.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu8.options.length; i++)
									{
										if (selectmenu8.options[i].selected)
											filterarray.push(selectmenu8.options[i].value);
									}
								 	sorter.setfilter(10, filterarray, 1);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_C70').selectedIndex = -1; sorter.setfilter(10, []);">remove filter</a>
                        </td>
                        <td width="104px">
                        	<select multiple size=10 id="list_EB" style="width:100px;">
                            	<?php
									for ($i = 0; $i <= count($EB_list_string); $i++)
									{
										echo '<option value="'.$EB_list_num[$i].'">'.$EB_list_string[$i].'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu9 = document.getElementById("list_EB")
								selectmenu9.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu9.options.length; i++)
									{
										if (selectmenu9.options[i].selected)
											filterarray.push(selectmenu9.options[i].value);
									}
								 	sorter.setfilter(11, filterarray, 1);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_EB').selectedIndex = -1; sorter.setfilter(11, []);">remove filter</a>
                        </td>
                        <td width="84px" class="filter">
                        	<select multiple size=10 id="list_usp" style="width:80px;">
                            	<?php
									foreach ($usp_list as $this_usp)
									{
										echo '<option>'.$this_usp.'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu10 = document.getElementById("list_usp")
								selectmenu10.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu10.options.length; i++)
									{
										if (selectmenu10.options[i].selected)
											filterarray.push(selectmenu10.options[i].text);
									}
								 	sorter.setfilter(12, filterarray, 0);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_usp').selectedIndex = -1; sorter.setfilter(12, []);">remove filter</a>
                        </td>
                        <td width="84px">
                        	<select multiple size=10 id="list_phase" style="width:80px;">
                            	<?php
									foreach ($phase_list as $this_phase)
									{
										echo '<option>'.$this_phase.'</option>';
									}
								?>
                            </select>
                            <script type="text/javascript">
								var selectmenu11 = document.getElementById("list_phase")
								selectmenu11.onchange=function()
								{
									var filterarray = [];
									for (var i = 0; i < selectmenu11.options.length; i++)
									{
										if (selectmenu11.options[i].selected)
											filterarray.push(selectmenu11.options[i].text);
									}
								 	sorter.setfilter(13, filterarray, 0);
								}
							</script>
                            <br/>
                            <a href="javascript:void(0)" onclick="document.getElementById('list_phase').selectedIndex = -1; sorter.setfilter(13, []);">remove filter</a>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-left:10px; padding-right:10px;">
                    	<tr>
                        	<td class="text_main" style="text-align:left;">
                            	<p style="font-size:11px;">
                            	<a href="javascript:void(0)" onclick="document.getElementById('list_manufacturer').selectedIndex = -1; document.getElementById('list_type').selectedIndex = -1;document.getElementById('list_H').selectedIndex = -1;document.getElementById('list_S').selectedIndex = -1;document.getElementById('list_A').selectedIndex = -1;document.getElementById('list_B').selectedIndex = -1;document.getElementById('list_C28').selectedIndex = -1;document.getElementById('list_C70').selectedIndex = -1;document.getElementById('list_EB').selectedIndex = -1;document.getElementById('list_usp').selectedIndex = -1;document.getElementById('list_phase').selectedIndex = -1;sorter.setfilter(3, []);sorter.setfilter(4, []);sorter.setfilter(5, []);sorter.setfilter(6, []);sorter.setfilter(7, []);sorter.setfilter(8, []);sorter.setfilter(9, []);sorter.setfilter(10, []);sorter.setfilter(11, []);sorter.setfilter(12, []);sorter.setfilter(13, []);">remove all filters</a>
                            	</p>
                            </td>
                        </tr>
				</table>
                <table cellpadding="0" cellspacing="0" border="0" id="table" class="sortable">
                    <thead>
                        <tr>
                            <th><h3>ID</h3></th>
                            <th><h3><i>F<sub>s</sub></i></h3></th>
                            <th><h3>Name</h3></th>
                            <th><h3>Manufacturer</h3></th>
                            <th><h3>Silica type</h3></th>
                            <th><h3 style="font-family:'Times New Roman', Times, serif;"><b>H</b></h3></th>
                            <th><h3 style="font-family:'Times New Roman', Times, serif;"><b>S*</b></h3></th>
                            <th><h3 style="font-family:'Times New Roman', Times, serif;"><b>A</b></h3></th>
                            <th><h3 style="font-family:'Times New Roman', Times, serif;"><b>B</b></h3></th>
                            <th><h3><span style="font-family:'Times New Roman', Times, serif;"><b>C</b></span> (pH 2.8)</h3></th>
                            <th><h3><span style="font-family:'Times New Roman', Times, serif;"><b>C</b></span> (pH 7.0)</span></h3></th>
                            <th><h3>EB retention factor</h3></th>
                            <th><h3>USP type</h3></th>
                            <th><h3>Phase type</h3></th>
                        </tr>
                    </thead>
                    <tbody>
                    	<?php
						
							function check_string($string)
							{
								if ($string == '')
								{
									return '&nbsp;';
								}
								return $string;
							}
							
							foreach ($column_data as $this_column)
							{
								// Now create the table row
								echo '<tr>';
								echo '<td>'.check_string($this_column["id"]).'</td>';
								echo '<td>'.'&nbsp;'.'</td>';
								echo '<td>'.check_string($this_column["name"]).'</td>';
								echo '<td>'.check_string($this_column["manufacturer"]).'</td>';
								echo '<td>'.check_string($this_column["type"]).'</td>';
								echo '<td>'.check_string($this_column["H"]).'</td>';
								echo '<td>'.check_string($this_column["S*"]).'</td>';
								echo '<td>'.check_string($this_column["A"]).'</td>';
								echo '<td>'.check_string($this_column["B"]).'</td>';
								echo '<td>'.check_string($this_column["C2.8"]).'</td>';
								echo '<td>'.check_string($this_column["C7.0"]).'</td>';
								echo '<td>'.check_string($this_column["EB retention"]).'</td>';
								echo '<td>'.check_string($this_column["USP"]).'</td>';
								echo '<td>'.check_string($this_column["phase"]).'</td>';
								echo '</tr>';
							}
						?>
                    </tbody>
              </table>
              	<div id="controls">
		<div id="perpage">
			<select onchange="sorter.size(this.value)" id="optpagesize">
			<option value="5">5</option>
				<option value="10" selected="selected">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
				<option value="100">100</option>
			</select>
			<span>Entries Per Page</span>
		</div>
		<div id="navigation">
			<img src="<?php echo $local_root;?>/tablesorter/images/first.gif" width="16" height="16" alt="First Page" onclick="sorter.move(-1,true)" />
			<img src="<?php echo $local_root;?>/tablesorter/images/previous.gif" width="16" height="16" alt="First Page" onclick="sorter.move(-1)" />
			<img src="<?php echo $local_root;?>/tablesorter/images/next.gif" width="16" height="16" alt="First Page" onclick="sorter.move(1)" />
			<img src="<?php echo $local_root;?>/tablesorter/images/last.gif" width="16" height="16" alt="Last Page" onclick="sorter.move(1,true)" />
		</div>
		<div id="text">Displaying Page <span id="currentpage"></span> of <span id="pagelimit"></span></div>
	</div>
	<script type="text/javascript" src="<?php echo 'http://' . $_SERVER['SERVER_NAME']; ?>/tablesorter/script.js"></script>
	<script type="text/javascript">
  var sorter = new TINY.table.sorter("sorter", document.getElementById("optpagesize").options[document.getElementById("optpagesize").selectedIndex].value);
	sorter.head = "head";
	sorter.asc = "asc";
	sorter.desc = "desc";
	sorter.even = "evenrow";
	sorter.odd = "oddrow";
	sorter.evensel = "evenselected";
	sorter.oddsel = "oddselected";
	sorter.paginate = true;
	sorter.currentid = "currentpage";
	sorter.limitid = "pagelimit";
	sorter.init("table", 1);
	var selectedColID = document.getElementById("list_allcolumns").options[document.getElementById("list_allcolumns").selectedIndex].value;
	sorter.calcNewFs(1, selectedColID, 0, 5, 6, 7, 8, 9);
  </script>

                <br />
                <br />
            </td>
        </tr>
    </table>
<?php
	include($_SERVER['DOCUMENT_ROOT'].'/template/footer.php');
?>