module.exports = {
	development : {
		app : {
			name : 'Passport SAML strategy example',
			port : process.env.PORT || 3000
		},
		passport: {
			strategy : 'saml',
			saml : {
				path : '/login/callback',
				//entryPoint : 'https://openidp.feide.no/simplesaml/saml2/idp/SSOService.php',
				entryPoint : 'http://sdm.im.ntu.edu.tw/simplesamlphp/saml2/idp/SSOService.php',
				//issuer : 'passport-saml'
				issuer : 'http://localhost:3000/metadata.php',
			}
		}
	}
}
