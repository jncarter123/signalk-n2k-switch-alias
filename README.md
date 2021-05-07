# signalk-n2k-switch-alias
This plugin works with NMEA 2000 switches such as the Maretron CKM12. It allows you to use the NMEA switch to control any switch path in SignalK. 

There are 4 options for the action to be taken when the button is depressed. Toggle On/Off, Toggle On, Toggle Off, and Momentary. 

## Maretron DCR100 Configuration
In this example I have two channels configured on a Maretron DCR100. One is for my engine room blowers and one is for my horn. I have configured the path names using the [PathMapper plugin](https://github.com/sbender9/signalk-path-mapper). The switches use the following paths.

ER Blowers = Instance 21, Indicator 5 = electrical.switches.bank.dclc21.erBlowers.state

Horn = Instance 21, Indicator 2 = electrical.switches.bank.dclc21.horn.state

## Maretron CKM12 Configuration
In this example I have configured the CMK12 to use device instance 30 on the NMEA network. I have further configured Key #8 LED for the blowers and Key #11 LED for the horn. When I press button #8, I want it to turn on the blowers and when I press key #11 I want it to blow the airhorn. 

![CKM12 Device Instance](https://user-images.githubusercontent.com/30420708/117512261-e4763d80-af54-11eb-8df7-214a75c49eb2.png)

![CMK12 Key Configuration](https://user-images.githubusercontent.com/30420708/117512395-269f7f00-af55-11eb-804a-8328ba170687.png)
## Plugin Installation
The plugin can be installed through the SignalK Appstore. 

![Plugin Installation](https://user-images.githubusercontent.com/30420708/117512638-9c0b4f80-af55-11eb-8120-29a3f9c2d0f8.png)

Once installed please restart SignalK.

## Plugin Configuration
Browse to the SignalK plugin cofiguration and open the NMEA 2000 Switch Alias plugin. Here you can click on the + sign and then associate the physical switch to the path you wish to control. In this example I first configured Instance 30 Indicator 8 to control electrical.switches.bank.dclc21.erBlowers.state.

![Blowers](https://user-images.githubusercontent.com/30420708/117512745-d7a61980-af55-11eb-8106-cc3cf834c6a0.png)

I then configured Instance 30 Indicator 11 to control electrical.switches.bank.dclc21.horn.state. In this case I only want the horn to blow so long as I am depressing the physical switch, so I set the action to Momentary.

![Horn](https://user-images.githubusercontent.com/30420708/117513017-6155e700-af56-11eb-856a-5ca89428f671.png)

When you are finished configuring the aliases, click the Submit button.
