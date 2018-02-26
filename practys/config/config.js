/*********************************************************************
 *
 *	Great Innovus Solutions Private Limited
 *
 *	Usage			: 	Config
 *
 *	Description 	: 	All the Server Side Configurations
 *
 *	Developer		: 	Sheema
 * 
 *	Date 			: 	30/08/2016
 *
 *	Version 		: 	1.0
 *
 **********************************************************************/
 module.exports	=	{
	"port"				: 	process.env.PORT || 8000,
	"SERVER_PATH"		: 	process.env.SERVER_PATH || "http://192.168.2.77:3000/"
};
