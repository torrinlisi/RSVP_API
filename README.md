Get rsvp
query params rsvpCode=ABCDEFG12
https://9ddaq8z128.execute-api.us-east-1.amazonaws.com/dev/rsvp


POST rsvp
body json
{
	"people": [
		{
			"allergies": "None",
			"mealID": 1,
			"isAttending": true,
			"rsvpPersonID": 74
		},
		{
			"allergies": "idk",
			"mealID": 2,
			"isAttending": true,
			"rsvpPersonID": 75
		}
	],
	"rsvpID": "39"
}
https://9ddaq8z128.execute-api.us-east-1.amazonaws.com/dev/rsvp
