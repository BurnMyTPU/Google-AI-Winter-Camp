!function(){"use strict";function e(e){return JSON.parse(JSON.stringify(e))}function t(e){for(var t=y(e);"ÿà"<=t[1].slice(0,2)&&t[1].slice(0,2)<="ÿï";)t=[t[0]].concat(t.slice(2));return t.join("")}function a(e){return s(">"+p("B",e.length),e)}function i(e){return s(">"+p("H",e.length),e)}function n(e){return s(">"+p("L",e.length),e)}function r(e,t,r){var o,l,m,y,c="",S="";if("Byte"==t)o=e.length,4>=o?S=a(e)+p("\x00",4-o):(S=s(">L",[r]),c=a(e));else if("Short"==t)o=e.length,2>=o?S=i(e)+p("\x00\x00",2-o):(S=s(">L",[r]),c=i(e));else if("Long"==t)o=e.length,1>=o?S=n(e):(S=s(">L",[r]),c=n(e));else if("Ascii"==t)l=e+"\x00",o=l.length,o>4?(S=s(">L",[r]),c=l):S=l+p("\x00",4-o);else if("Rational"==t){if("number"==typeof e[0])o=1,m=e[0],y=e[1],l=s(">L",[m])+s(">L",[y]);else{o=e.length,l="";for(var f=0;o>f;f++)m=e[f][0],y=e[f][1],l+=s(">L",[m])+s(">L",[y])}S=s(">L",[r]),c=l}else if("SRational"==t){if("number"==typeof e[0])o=1,m=e[0],y=e[1],l=s(">l",[m])+s(">l",[y]);else{o=e.length,l="";for(var f=0;o>f;f++)m=e[f][0],y=e[f][1],l+=s(">l",[m])+s(">l",[y])}S=s(">L",[r]),c=l}else"Undefined"==t&&(o=e.length,o>4?(S=s(">L",[r]),c=e):S=e+p("\x00",4-o));var h=s(">L",[o]);return[h,S,c]}function o(e,t,a){var i,n=8,o=Object.keys(e).length,l=s(">H",[o]);i=["0th","1st"].indexOf(t)>-1?2+12*o+4:2+12*o;var m,p="",y="";for(var m in e)if("string"==typeof m&&(m=parseInt(m)),!("0th"==t&&[34665,34853].indexOf(m)>-1||"Exif"==t&&40965==m||"1st"==t&&[513,514].indexOf(m)>-1)){var c=e[m],S=s(">H",[m]),f=u[t][m].type,h=s(">H",[g[f]]);"number"==typeof c&&(c=[c]);var d=n+i+a+y.length,P=r(c,f,d),C=P[0],R=P[1],L=P[2];p+=S+h+C+R,y+=L}return[l+p,y]}function l(e){var t,a;if("ÿØ"==e.slice(0,2))t=y(e),a=c(t),a?this.tiftag=a.slice(10):this.tiftag=null;else if(["II","MM"].indexOf(e.slice(0,2))>-1)this.tiftag=e;else{if("Exif"!=e.slice(0,4))throw"Given file is neither JPEG nor TIFF.";this.tiftag=e.slice(6)}}function s(e,t){if(!(t instanceof Array))throw"'pack' error. Got invalid type argument.";if(e.length-1!=t.length)throw"'pack' error. "+(e.length-1)+" marks, "+t.length+" elements.";var a;if("<"==e[0])a=!0;else{if(">"!=e[0])throw"";a=!1}for(var i="",n=1,r=null,o=null,l=null;o=e[n];){if("b"==o.toLowerCase()){if(r=t[n-1],"b"==o&&0>r&&(r+=256),r>255||0>r)throw"'pack' error.";l=String.fromCharCode(r)}else if("H"==o){if(r=t[n-1],r>65535||0>r)throw"'pack' error.";l=String.fromCharCode(Math.floor(r%65536/256))+String.fromCharCode(r%256),a&&(l=l.split("").reverse().join(""))}else{if("l"!=o.toLowerCase())throw"'pack' error.";if(r=t[n-1],"l"==o&&0>r&&(r+=4294967296),r>4294967295||0>r)throw"'pack' error.";l=String.fromCharCode(Math.floor(r/16777216))+String.fromCharCode(Math.floor(r%16777216/65536))+String.fromCharCode(Math.floor(r%65536/256))+String.fromCharCode(r%256),a&&(l=l.split("").reverse().join(""))}i+=l,n+=1}return i}function m(e,t){if("string"!=typeof t)throw"'unpack' error. Got invalid type argument.";for(var a=0,i=1;i<e.length;i++)if("b"==e[i].toLowerCase())a+=1;else if("h"==e[i].toLowerCase())a+=2;else{if("l"!=e[i].toLowerCase())throw"'unpack' error. Got invalid mark.";a+=4}if(a!=t.length)throw"'unpack' error. Mismatch between symbol and string length. "+a+":"+t.length;var n;if("<"==e[0])n=!0;else{if(">"!=e[0])throw"'unpack' error.";n=!1}for(var r=[],o=0,l=1,s=null,m=null,p=null,y="";m=e[l];){if("b"==m.toLowerCase())p=1,y=t.slice(o,o+p),s=y.charCodeAt(0),"b"==m&&s>=128&&(s-=256);else if("H"==m)p=2,y=t.slice(o,o+p),n&&(y=y.split("").reverse().join("")),s=256*y.charCodeAt(0)+y.charCodeAt(1);else{if("l"!=m.toLowerCase())throw"'unpack' error. "+m;p=4,y=t.slice(o,o+p),n&&(y=y.split("").reverse().join("")),s=16777216*y.charCodeAt(0)+65536*y.charCodeAt(1)+256*y.charCodeAt(2)+y.charCodeAt(3),"l"==m&&s>=2147483648&&(s-=4294967296)}r.push(s),o+=p,l+=1}return r}function p(e,t){for(var a="",i=0;t>i;i++)a+=e;return a}function y(e){if("ÿØ"!=e.slice(0,2))throw"Given data isn't JPEG.";for(var t=2,a=["ÿØ"];;){if("ÿÚ"==e.slice(t,t+2)){a.push(e.slice(t));break}var i=m(">H",e.slice(t+2,t+4))[0],n=t+i+2;if(a.push(e.slice(t,n)),t=n,t>=e.length)throw"Wrong JPEG data."}return a}function c(e){for(var t,a=0;a<e.length;a++)if(t=e[a],"ÿá"==t.slice(0,2)&&"Exif\x00\x00"==t.slice(4,10))return t;return null}function S(e,t){return"ÿà"==e[1].slice(0,2)&&"ÿá"==e[2].slice(0,2)&&"Exif\x00\x00"==e[2].slice(4,10)?t?(e[2]=t,e=["ÿØ"].concat(e.slice(2))):e=null==t?e.slice(0,2).concat(e.slice(3)):e.slice(0).concat(e.slice(2)):"ÿà"==e[1].slice(0,2)?t&&(e[1]=t):"ÿá"==e[1].slice(0,2)&&"Exif\x00\x00"==e[1].slice(4,10)?t?e[1]=t:null==t&&(e=e.slice(0).concat(e.slice(2))):t&&(e=[e[0],t].concat(e.slice(1))),e.join("")}var f={};if(f.version="1.03",f.remove=function(e){var t=!1;if("ÿØ"==e.slice(0,2));else{if("data:image/jpeg;base64,"!=e.slice(0,23)&&"data:image/jpg;base64,"!=e.slice(0,22))throw"Given data is not jpeg.";e=d(e.split(",")[1]),t=!0}var a=y(e);if("ÿá"==a[1].slice(0,2)&&"Exif\x00\x00"==a[1].slice(4,10))a=[a[0]].concat(a.slice(2));else{if("ÿá"!=a[2].slice(0,2)||"Exif\x00\x00"!=a[2].slice(4,10))throw"Exif not found.";a=a.slice(0,2).concat(a.slice(3))}var i=a.join("");return t&&(i="data:image/jpeg;base64,"+h(i)),i},f.insert=function(e,t){var a=!1;if("Exif\x00\x00"!=e.slice(0,6))throw"Given data is not exif.";if("ÿØ"==t.slice(0,2));else{if("data:image/jpeg;base64,"!=t.slice(0,23)&&"data:image/jpg;base64,"!=t.slice(0,22))throw"Given data is not jpeg.";t=d(t.split(",")[1]),a=!0}var i="ÿá"+s(">H",[e.length+2])+e,n=y(t),r=S(n,i);return a&&(r="data:image/jpeg;base64,"+h(r)),r},f.load=function(e){var t;if("string"!=typeof e)throw"'load' gots invalid type argument.";if("ÿØ"==e.slice(0,2))t=e;else if("data:image/jpeg;base64,"==e.slice(0,23)||"data:image/jpg;base64,"==e.slice(0,22))t=d(e.split(",")[1]);else{if("Exif"!=e.slice(0,4))throw"'load' gots invalid file data.";t=e.slice(6)}var a={"0th":{},Exif:{},GPS:{},Interop:{},"1st":{},thumbnail:null},i=new l(t);if(null===i.tiftag)return a;"II"==i.tiftag.slice(0,2)?i.endian_mark="<":i.endian_mark=">";var n=m(i.endian_mark+"L",i.tiftag.slice(4,8))[0];a["0th"]=i.get_ifd(n,"0th");var r=a["0th"].first_ifd_pointer;if(delete a["0th"].first_ifd_pointer,34665 in a["0th"]&&(n=a["0th"][34665],a.Exif=i.get_ifd(n,"Exif")),34853 in a["0th"]&&(n=a["0th"][34853],a.GPS=i.get_ifd(n,"GPS")),40965 in a.Exif&&(n=a.Exif[40965],a.Interop=i.get_ifd(n,"Interop")),"\x00\x00\x00\x00"!=r&&(n=m(i.endian_mark+"L",r)[0],a["1st"]=i.get_ifd(n,"1st"),513 in a["1st"]&&514 in a["1st"])){var o=a["1st"][513]+a["1st"][514],s=i.tiftag.slice(a["1st"][513],o);a.thumbnail=s}return a},f.dump=function(a){var i,n,r,l,m,p=8,y=e(a),c="Exif\x00\x00MM\x00*\x00\x00\x00\b",S=!1,h=!1,d=!1,u=!1;i="0th"in y?y["0th"]:{},"Exif"in y&&Object.keys(y.Exif).length||"Interop"in y&&Object.keys(y.Interop).length?(i[34665]=1,S=!0,n=y.Exif,"Interop"in y&&Object.keys(y.Interop).length?(n[40965]=1,d=!0,r=y.Interop):Object.keys(n).indexOf(f.ExifIFD.InteroperabilityTag.toString())>-1&&delete n[40965]):Object.keys(i).indexOf(f.ImageIFD.ExifTag.toString())>-1&&delete i[34665],"GPS"in y&&Object.keys(y.GPS).length?(i[f.ImageIFD.GPSTag]=1,h=!0,l=y.GPS):Object.keys(i).indexOf(f.ImageIFD.GPSTag.toString())>-1&&delete i[f.ImageIFD.GPSTag],"1st"in y&&"thumbnail"in y&&null!=y.thumbnail&&(u=!0,y["1st"][513]=1,y["1st"][514]=1,m=y["1st"]);var P,C,R,L,x,I=o(i,"0th",0),D=I[0].length+12*S+12*h+4+I[1].length,G="",A=0,v="",b=0,T="",k=0,w="";if(S&&(P=o(n,"Exif",D),A=P[0].length+12*d+P[1].length),h&&(C=o(l,"GPS",D+A),v=C.join(""),b=v.length),d){var F=D+A+b;R=o(r,"Interop",F),T=R.join(""),k=T.length}if(u){var F=D+A+b+k;if(L=o(m,"1st",F),x=t(y.thumbnail),x.length>64e3)throw"Given thumbnail is too large. max 64kB"}var B="",E="",M="",O="\x00\x00\x00\x00";if(S){var N=p+D,U=s(">L",[N]),_=34665,H=s(">H",[_]),j=s(">H",[g.Long]),V=s(">L",[1]);B=H+j+V+U}if(h){var N=p+D+A,U=s(">L",[N]),_=34853,H=s(">H",[_]),j=s(">H",[g.Long]),V=s(">L",[1]);E=H+j+V+U}if(d){var N=p+D+A+b,U=s(">L",[N]),_=40965,H=s(">H",[_]),j=s(">H",[g.Long]),V=s(">L",[1]);M=H+j+V+U}if(u){var N=p+D+A+b+k;O=s(">L",[N]);var J=N+L[0].length+24+4+L[1].length,X="\x00\x00\x00\x00"+s(">L",[J]),z="\x00\x00\x00\x00"+s(">L",[x.length]);w=L[0]+X+z+"\x00\x00\x00\x00"+L[1]+x}var Y=I[0]+B+E+O+I[1];return S&&(G=P[0]+M+P[1]),c+Y+G+v+T+w},l.prototype={get_ifd:function(e,t){var a,i={},n=m(this.endian_mark+"H",this.tiftag.slice(e,e+2))[0],r=e+2;a=["0th","1st"].indexOf(t)>-1?"Image":t;for(var o=0;n>o;o++){e=r+12*o;var l=m(this.endian_mark+"H",this.tiftag.slice(e,e+2))[0],s=m(this.endian_mark+"H",this.tiftag.slice(e+2,e+4))[0],p=m(this.endian_mark+"L",this.tiftag.slice(e+4,e+8))[0],y=this.tiftag.slice(e+8,e+12),c=[s,p,y];l in u[a]&&(i[l]=this.convert_value(c))}return"0th"==t&&(e=r+12*n,i.first_ifd_pointer=this.tiftag.slice(e,e+4)),i},convert_value:function(e){var t,a=null,i=e[0],n=e[1],r=e[2];if(1==i)n>4?(t=m(this.endian_mark+"L",r)[0],a=m(this.endian_mark+p("B",n),this.tiftag.slice(t,t+n))):a=m(this.endian_mark+p("B",n),r.slice(0,n));else if(2==i)n>4?(t=m(this.endian_mark+"L",r)[0],a=this.tiftag.slice(t,t+n-1)):a=r.slice(0,n-1);else if(3==i)n>2?(t=m(this.endian_mark+"L",r)[0],a=m(this.endian_mark+p("H",n),this.tiftag.slice(t,t+2*n))):a=m(this.endian_mark+p("H",n),r.slice(0,2*n));else if(4==i)n>1?(t=m(this.endian_mark+"L",r)[0],a=m(this.endian_mark+p("L",n),this.tiftag.slice(t,t+4*n))):a=m(this.endian_mark+p("L",n),r);else if(5==i)if(t=m(this.endian_mark+"L",r)[0],n>1){a=[];for(var o=0;n>o;o++)a.push([m(this.endian_mark+"L",this.tiftag.slice(t+8*o,t+4+8*o))[0],m(this.endian_mark+"L",this.tiftag.slice(t+4+8*o,t+8+8*o))[0]])}else a=[m(this.endian_mark+"L",this.tiftag.slice(t,t+4))[0],m(this.endian_mark+"L",this.tiftag.slice(t+4,t+8))[0]];else if(7==i)n>4?(t=m(this.endian_mark+"L",r)[0],a=this.tiftag.slice(t,t+n)):a=r.slice(0,n);else{if(10!=i)throw"Exif might be wrong. Got incorrect value type to decode. type:"+i;if(t=m(this.endian_mark+"L",r)[0],n>1){a=[];for(var o=0;n>o;o++)a.push([m(this.endian_mark+"l",this.tiftag.slice(t+8*o,t+4+8*o))[0],m(this.endian_mark+"l",this.tiftag.slice(t+4+8*o,t+8+8*o))[0]])}else a=[m(this.endian_mark+"l",this.tiftag.slice(t,t+4))[0],m(this.endian_mark+"l",this.tiftag.slice(t+4,t+8))[0]]}return a instanceof Array&&1==a.length?a[0]:a}},"undefined"!=typeof window&&"function"==typeof window.btoa)var h=window.btoa;if("undefined"==typeof h)var h=function(e){for(var t,a,i,n,r,o,l,s="",m=0,p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";m<e.length;)t=e.charCodeAt(m++),a=e.charCodeAt(m++),i=e.charCodeAt(m++),n=t>>2,r=(3&t)<<4|a>>4,o=(15&a)<<2|i>>6,l=63&i,isNaN(a)?o=l=64:isNaN(i)&&(l=64),s=s+p.charAt(n)+p.charAt(r)+p.charAt(o)+p.charAt(l);return s};if("undefined"!=typeof window&&"function"==typeof window.atob)var d=window.atob;if("undefined"==typeof d)var d=function(e){var t,a,i,n,r,o,l,s="",m=0,p="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";for(e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");m<e.length;)n=p.indexOf(e.charAt(m++)),r=p.indexOf(e.charAt(m++)),o=p.indexOf(e.charAt(m++)),l=p.indexOf(e.charAt(m++)),t=n<<2|r>>4,a=(15&r)<<4|o>>2,i=(3&o)<<6|l,s+=String.fromCharCode(t),64!=o&&(s+=String.fromCharCode(a)),64!=l&&(s+=String.fromCharCode(i));return s};var g={Byte:1,Ascii:2,Short:3,Long:4,Rational:5,Undefined:7,SLong:9,SRational:10},u={Image:{11:{name:"ProcessingSoftware",type:"Ascii"},254:{name:"NewSubfileType",type:"Long"},255:{name:"SubfileType",type:"Short"},256:{name:"ImageWidth",type:"Long"},257:{name:"ImageLength",type:"Long"},258:{name:"BitsPerSample",type:"Short"},259:{name:"Compression",type:"Short"},262:{name:"PhotometricInterpretation",type:"Short"},263:{name:"Threshholding",type:"Short"},264:{name:"CellWidth",type:"Short"},265:{name:"CellLength",type:"Short"},266:{name:"FillOrder",type:"Short"},269:{name:"DocumentName",type:"Ascii"},270:{name:"ImageDescription",type:"Ascii"},271:{name:"Make",type:"Ascii"},272:{name:"Model",type:"Ascii"},273:{name:"StripOffsets",type:"Long"},274:{name:"Orientation",type:"Short"},277:{name:"SamplesPerPixel",type:"Short"},278:{name:"RowsPerStrip",type:"Long"},279:{name:"StripByteCounts",type:"Long"},282:{name:"XResolution",type:"Rational"},283:{name:"YResolution",type:"Rational"},284:{name:"PlanarConfiguration",type:"Short"},290:{name:"GrayResponseUnit",type:"Short"},291:{name:"GrayResponseCurve",type:"Short"},292:{name:"T4Options",type:"Long"},293:{name:"T6Options",type:"Long"},296:{name:"ResolutionUnit",type:"Short"},301:{name:"TransferFunction",type:"Short"},305:{name:"Software",type:"Ascii"},306:{name:"DateTime",type:"Ascii"},315:{name:"Artist",type:"Ascii"},316:{name:"HostComputer",type:"Ascii"},317:{name:"Predictor",type:"Short"},318:{name:"WhitePoint",type:"Rational"},319:{name:"PrimaryChromaticities",type:"Rational"},320:{name:"ColorMap",type:"Short"},321:{name:"HalftoneHints",type:"Short"},322:{name:"TileWidth",type:"Short"},323:{name:"TileLength",type:"Short"},324:{name:"TileOffsets",type:"Short"},325:{name:"TileByteCounts",type:"Short"},330:{name:"SubIFDs",type:"Long"},332:{name:"InkSet",type:"Short"},333:{name:"InkNames",type:"Ascii"},334:{name:"NumberOfInks",type:"Short"},336:{name:"DotRange",type:"Byte"},337:{name:"TargetPrinter",type:"Ascii"},338:{name:"ExtraSamples",type:"Short"},339:{name:"SampleFormat",type:"Short"},340:{name:"SMinSampleValue",type:"Short"},341:{name:"SMaxSampleValue",type:"Short"},342:{name:"TransferRange",type:"Short"},343:{name:"ClipPath",type:"Byte"},344:{name:"XClipPathUnits",type:"Long"},345:{name:"YClipPathUnits",type:"Long"},346:{name:"Indexed",type:"Short"},347:{name:"JPEGTables",type:"Undefined"},351:{name:"OPIProxy",type:"Short"},512:{name:"JPEGProc",type:"Long"},513:{name:"JPEGInterchangeFormat",type:"Long"},514:{name:"JPEGInterchangeFormatLength",type:"Long"},515:{name:"JPEGRestartInterval",type:"Short"},517:{name:"JPEGLosslessPredictors",type:"Short"},518:{name:"JPEGPointTransforms",type:"Short"},519:{name:"JPEGQTables",type:"Long"},520:{name:"JPEGDCTables",type:"Long"},521:{name:"JPEGACTables",type:"Long"},529:{name:"YCbCrCoefficients",type:"Rational"},530:{name:"YCbCrSubSampling",type:"Short"},531:{name:"YCbCrPositioning",type:"Short"},532:{name:"ReferenceBlackWhite",type:"Rational"},700:{name:"XMLPacket",type:"Byte"},18246:{name:"Rating",type:"Short"},18249:{name:"RatingPercent",type:"Short"},32781:{name:"ImageID",type:"Ascii"},33421:{name:"CFARepeatPatternDim",type:"Short"},33422:{name:"CFAPattern",type:"Byte"},33423:{name:"BatteryLevel",type:"Rational"},33432:{name:"Copyright",type:"Ascii"},33434:{name:"ExposureTime",type:"Rational"},34377:{name:"ImageResources",type:"Byte"},34665:{name:"ExifTag",type:"Long"},34675:{name:"InterColorProfile",type:"Undefined"},34853:{name:"GPSTag",type:"Long"},34857:{name:"Interlace",type:"Short"},34858:{name:"TimeZoneOffset",type:"Long"},34859:{name:"SelfTimerMode",type:"Short"},37387:{name:"FlashEnergy",type:"Rational"},37388:{name:"SpatialFrequencyResponse",type:"Undefined"},37389:{name:"Noise",type:"Undefined"},37390:{name:"FocalPlaneXResolution",type:"Rational"},37391:{name:"FocalPlaneYResolution",type:"Rational"},37392:{name:"FocalPlaneResolutionUnit",type:"Short"},37393:{name:"ImageNumber",type:"Long"},37394:{name:"SecurityClassification",type:"Ascii"},37395:{name:"ImageHistory",type:"Ascii"},37397:{name:"ExposureIndex",type:"Rational"},37398:{name:"TIFFEPStandardID",type:"Byte"},37399:{name:"SensingMethod",type:"Short"},40091:{name:"XPTitle",type:"Byte"},40092:{name:"XPComment",type:"Byte"},40093:{name:"XPAuthor",type:"Byte"},40094:{name:"XPKeywords",type:"Byte"},40095:{name:"XPSubject",type:"Byte"},50341:{name:"PrintImageMatching",type:"Undefined"},50706:{name:"DNGVersion",type:"Byte"},50707:{name:"DNGBackwardVersion",type:"Byte"},50708:{name:"UniqueCameraModel",type:"Ascii"},50709:{name:"LocalizedCameraModel",type:"Byte"},50710:{name:"CFAPlaneColor",type:"Byte"},50711:{name:"CFALayout",type:"Short"},50712:{name:"LinearizationTable",type:"Short"},50713:{name:"BlackLevelRepeatDim",type:"Short"},50714:{name:"BlackLevel",type:"Rational"},50715:{name:"BlackLevelDeltaH",type:"SRational"},50716:{name:"BlackLevelDeltaV",type:"SRational"},50717:{name:"WhiteLevel",type:"Short"},50718:{name:"DefaultScale",type:"Rational"},50719:{name:"DefaultCropOrigin",type:"Short"},50720:{name:"DefaultCropSize",type:"Short"},50721:{name:"ColorMatrix1",type:"SRational"},50722:{name:"ColorMatrix2",type:"SRational"},50723:{name:"CameraCalibration1",type:"SRational"},50724:{name:"CameraCalibration2",type:"SRational"},50725:{name:"ReductionMatrix1",type:"SRational"},50726:{name:"ReductionMatrix2",type:"SRational"},50727:{name:"AnalogBalance",type:"Rational"},50728:{name:"AsShotNeutral",type:"Short"},50729:{name:"AsShotWhiteXY",type:"Rational"},50730:{name:"BaselineExposure",type:"SRational"},50731:{name:"BaselineNoise",type:"Rational"},50732:{name:"BaselineSharpness",type:"Rational"},50733:{name:"BayerGreenSplit",type:"Long"},50734:{name:"LinearResponseLimit",type:"Rational"},50735:{name:"CameraSerialNumber",type:"Ascii"},50736:{name:"LensInfo",type:"Rational"},50737:{name:"ChromaBlurRadius",type:"Rational"},50738:{name:"AntiAliasStrength",type:"Rational"},50739:{name:"ShadowScale",type:"SRational"},50740:{name:"DNGPrivateData",type:"Byte"},50741:{name:"MakerNoteSafety",type:"Short"},50778:{name:"CalibrationIlluminant1",type:"Short"},50779:{name:"CalibrationIlluminant2",type:"Short"},50780:{name:"BestQualityScale",type:"Rational"},50781:{name:"RawDataUniqueID",type:"Byte"},50827:{name:"OriginalRawFileName",type:"Byte"},50828:{name:"OriginalRawFileData",type:"Undefined"},50829:{name:"ActiveArea",type:"Short"},50830:{name:"MaskedAreas",type:"Short"},50831:{name:"AsShotICCProfile",type:"Undefined"},50832:{name:"AsShotPreProfileMatrix",type:"SRational"},50833:{name:"CurrentICCProfile",type:"Undefined"},50834:{name:"CurrentPreProfileMatrix",type:"SRational"},50879:{name:"ColorimetricReference",type:"Short"},50931:{name:"CameraCalibrationSignature",type:"Byte"},50932:{name:"ProfileCalibrationSignature",type:"Byte"},50934:{name:"AsShotProfileName",type:"Byte"},50935:{name:"NoiseReductionApplied",type:"Rational"},50936:{name:"ProfileName",type:"Byte"},50937:{name:"ProfileHueSatMapDims",type:"Long"},50938:{name:"ProfileHueSatMapData1",type:"Float"},50939:{name:"ProfileHueSatMapData2",type:"Float"},50940:{name:"ProfileToneCurve",type:"Float"},50941:{name:"ProfileEmbedPolicy",type:"Long"},50942:{name:"ProfileCopyright",type:"Byte"},50964:{name:"ForwardMatrix1",type:"SRational"},50965:{name:"ForwardMatrix2",type:"SRational"},50966:{name:"PreviewApplicationName",type:"Byte"},50967:{name:"PreviewApplicationVersion",type:"Byte"},50968:{name:"PreviewSettingsName",type:"Byte"},50969:{name:"PreviewSettingsDigest",type:"Byte"},50970:{name:"PreviewColorSpace",type:"Long"},50971:{name:"PreviewDateTime",type:"Ascii"},50972:{name:"RawImageDigest",type:"Undefined"},50973:{name:"OriginalRawFileDigest",type:"Undefined"},50974:{name:"SubTileBlockSize",type:"Long"},50975:{name:"RowInterleaveFactor",type:"Long"},50981:{name:"ProfileLookTableDims",type:"Long"},50982:{name:"ProfileLookTableData",type:"Float"},51008:{name:"OpcodeList1",type:"Undefined"},51009:{name:"OpcodeList2",type:"Undefined"},51022:{name:"OpcodeList3",type:"Undefined"}},Exif:{33434:{name:"ExposureTime",type:"Rational"},33437:{name:"FNumber",type:"Rational"},34850:{name:"ExposureProgram",type:"Short"},34852:{name:"SpectralSensitivity",type:"Ascii"},34855:{name:"ISOSpeedRatings",type:"Short"},34856:{name:"OECF",type:"Undefined"},34864:{name:"SensitivityType",type:"Short"},34865:{name:"StandardOutputSensitivity",type:"Long"},34866:{name:"RecommendedExposureIndex",type:"Long"},34867:{name:"ISOSpeed",type:"Long"},34868:{name:"ISOSpeedLatitudeyyy",type:"Long"},34869:{name:"ISOSpeedLatitudezzz",type:"Long"},36864:{name:"ExifVersion",type:"Undefined"},36867:{name:"DateTimeOriginal",type:"Ascii"},36868:{name:"DateTimeDigitized",type:"Ascii"},37121:{name:"ComponentsConfiguration",type:"Undefined"},37122:{name:"CompressedBitsPerPixel",type:"Rational"},37377:{name:"ShutterSpeedValue",type:"SRational"},37378:{name:"ApertureValue",type:"Rational"},37379:{name:"BrightnessValue",type:"SRational"},37380:{name:"ExposureBiasValue",type:"SRational"},37381:{name:"MaxApertureValue",type:"Rational"},37382:{name:"SubjectDistance",type:"Rational"},37383:{name:"MeteringMode",type:"Short"},37384:{name:"LightSource",type:"Short"},37385:{name:"Flash",type:"Short"},37386:{name:"FocalLength",type:"Rational"},37396:{name:"SubjectArea",type:"Short"},37500:{name:"MakerNote",type:"Undefined"},37510:{name:"UserComment",type:"Ascii"},37520:{name:"SubSecTime",type:"Ascii"},37521:{name:"SubSecTimeOriginal",type:"Ascii"},37522:{name:"SubSecTimeDigitized",type:"Ascii"},40960:{name:"FlashpixVersion",type:"Undefined"},40961:{name:"ColorSpace",type:"Short"},40962:{name:"PixelXDimension",type:"Long"},40963:{name:"PixelYDimension",type:"Long"},40964:{name:"RelatedSoundFile",type:"Ascii"},40965:{name:"InteroperabilityTag",type:"Long"},41483:{name:"FlashEnergy",type:"Rational"},41484:{name:"SpatialFrequencyResponse",type:"Undefined"},41486:{name:"FocalPlaneXResolution",type:"Rational"},41487:{name:"FocalPlaneYResolution",type:"Rational"},41488:{name:"FocalPlaneResolutionUnit",type:"Short"},41492:{name:"SubjectLocation",type:"Short"},41493:{name:"ExposureIndex",type:"Rational"},41495:{name:"SensingMethod",type:"Short"},41728:{name:"FileSource",type:"Undefined"},41729:{name:"SceneType",type:"Undefined"},41730:{name:"CFAPattern",type:"Undefined"},41985:{name:"CustomRendered",type:"Short"},41986:{name:"ExposureMode",type:"Short"},41987:{name:"WhiteBalance",type:"Short"},41988:{name:"DigitalZoomRatio",type:"Rational"},41989:{name:"FocalLengthIn35mmFilm",type:"Short"},41990:{name:"SceneCaptureType",type:"Short"},41991:{name:"GainControl",type:"Short"},41992:{name:"Contrast",type:"Short"},41993:{name:"Saturation",type:"Short"},41994:{name:"Sharpness",type:"Short"},41995:{name:"DeviceSettingDescription",type:"Undefined"},41996:{name:"SubjectDistanceRange",type:"Short"},42016:{name:"ImageUniqueID",type:"Ascii"},42032:{name:"CameraOwnerName",type:"Ascii"},42033:{name:"BodySerialNumber",type:"Ascii"},42034:{name:"LensSpecification",type:"Rational"},42035:{name:"LensMake",type:"Ascii"},42036:{name:"LensModel",type:"Ascii"},42037:{name:"LensSerialNumber",type:"Ascii"},42240:{name:"Gamma",type:"Rational"}},GPS:{0:{name:"GPSVersionID",type:"Byte"},1:{name:"GPSLatitudeRef",type:"Ascii"},2:{name:"GPSLatitude",type:"Rational"},3:{name:"GPSLongitudeRef",type:"Ascii"},4:{name:"GPSLongitude",type:"Rational"},5:{name:"GPSAltitudeRef",type:"Byte"},6:{name:"GPSAltitude",type:"Rational"},7:{name:"GPSTimeStamp",type:"Rational"},8:{name:"GPSSatellites",type:"Ascii"},9:{name:"GPSStatus",type:"Ascii"},10:{name:"GPSMeasureMode",type:"Ascii"},11:{name:"GPSDOP",type:"Rational"},12:{name:"GPSSpeedRef",type:"Ascii"},13:{name:"GPSSpeed",type:"Rational"},14:{name:"GPSTrackRef",type:"Ascii"},15:{name:"GPSTrack",type:"Rational"},16:{name:"GPSImgDirectionRef",type:"Ascii"},17:{name:"GPSImgDirection",type:"Rational"},18:{name:"GPSMapDatum",type:"Ascii"},19:{name:"GPSDestLatitudeRef",type:"Ascii"},20:{name:"GPSDestLatitude",type:"Rational"},21:{name:"GPSDestLongitudeRef",type:"Ascii"},22:{name:"GPSDestLongitude",type:"Rational"},23:{name:"GPSDestBearingRef",type:"Ascii"},24:{name:"GPSDestBearing",type:"Rational"},25:{name:"GPSDestDistanceRef",type:"Ascii"},26:{name:"GPSDestDistance",type:"Rational"},27:{name:"GPSProcessingMethod",type:"Undefined"},28:{name:"GPSAreaInformation",type:"Undefined"},29:{name:"GPSDateStamp",type:"Ascii"},30:{name:"GPSDifferential",type:"Short"},31:{name:"GPSHPositioningError",type:"Rational"}},Interop:{1:{name:"InteroperabilityIndex",type:"Ascii"}}};u["0th"]=u.Image,u["1st"]=u.Image,f.TAGS=u,f.ImageIFD={ProcessingSoftware:11,NewSubfileType:254,SubfileType:255,ImageWidth:256,ImageLength:257,BitsPerSample:258,Compression:259,PhotometricInterpretation:262,Threshholding:263,CellWidth:264,CellLength:265,FillOrder:266,DocumentName:269,ImageDescription:270,Make:271,Model:272,StripOffsets:273,Orientation:274,SamplesPerPixel:277,RowsPerStrip:278,StripByteCounts:279,XResolution:282,YResolution:283,PlanarConfiguration:284,GrayResponseUnit:290,GrayResponseCurve:291,T4Options:292,T6Options:293,ResolutionUnit:296,TransferFunction:301,Software:305,DateTime:306,Artist:315,HostComputer:316,Predictor:317,WhitePoint:318,PrimaryChromaticities:319,ColorMap:320,HalftoneHints:321,TileWidth:322,TileLength:323,TileOffsets:324,TileByteCounts:325,SubIFDs:330,InkSet:332,InkNames:333,NumberOfInks:334,DotRange:336,TargetPrinter:337,ExtraSamples:338,SampleFormat:339,SMinSampleValue:340,SMaxSampleValue:341,TransferRange:342,ClipPath:343,XClipPathUnits:344,YClipPathUnits:345,Indexed:346,JPEGTables:347,OPIProxy:351,JPEGProc:512,JPEGInterchangeFormat:513,JPEGInterchangeFormatLength:514,JPEGRestartInterval:515,JPEGLosslessPredictors:517,JPEGPointTransforms:518,JPEGQTables:519,JPEGDCTables:520,JPEGACTables:521,YCbCrCoefficients:529,YCbCrSubSampling:530,YCbCrPositioning:531,ReferenceBlackWhite:532,XMLPacket:700,Rating:18246,RatingPercent:18249,ImageID:32781,CFARepeatPatternDim:33421,CFAPattern:33422,BatteryLevel:33423,Copyright:33432,ExposureTime:33434,ImageResources:34377,ExifTag:34665,InterColorProfile:34675,GPSTag:34853,Interlace:34857,TimeZoneOffset:34858,SelfTimerMode:34859,FlashEnergy:37387,SpatialFrequencyResponse:37388,Noise:37389,FocalPlaneXResolution:37390,FocalPlaneYResolution:37391,FocalPlaneResolutionUnit:37392,ImageNumber:37393,SecurityClassification:37394,ImageHistory:37395,ExposureIndex:37397,TIFFEPStandardID:37398,SensingMethod:37399,XPTitle:40091,XPComment:40092,XPAuthor:40093,XPKeywords:40094,XPSubject:40095,PrintImageMatching:50341,DNGVersion:50706,DNGBackwardVersion:50707,UniqueCameraModel:50708,LocalizedCameraModel:50709,CFAPlaneColor:50710,CFALayout:50711,LinearizationTable:50712,BlackLevelRepeatDim:50713,BlackLevel:50714,BlackLevelDeltaH:50715,BlackLevelDeltaV:50716,WhiteLevel:50717,DefaultScale:50718,DefaultCropOrigin:50719,DefaultCropSize:50720,ColorMatrix1:50721,ColorMatrix2:50722,CameraCalibration1:50723,CameraCalibration2:50724,ReductionMatrix1:50725,ReductionMatrix2:50726,AnalogBalance:50727,AsShotNeutral:50728,AsShotWhiteXY:50729,BaselineExposure:50730,BaselineNoise:50731,BaselineSharpness:50732,BayerGreenSplit:50733,LinearResponseLimit:50734,CameraSerialNumber:50735,LensInfo:50736,ChromaBlurRadius:50737,AntiAliasStrength:50738,ShadowScale:50739,DNGPrivateData:50740,MakerNoteSafety:50741,CalibrationIlluminant1:50778,CalibrationIlluminant2:50779,BestQualityScale:50780,RawDataUniqueID:50781,OriginalRawFileName:50827,OriginalRawFileData:50828,ActiveArea:50829,MaskedAreas:50830,AsShotICCProfile:50831,AsShotPreProfileMatrix:50832,CurrentICCProfile:50833,CurrentPreProfileMatrix:50834,ColorimetricReference:50879,CameraCalibrationSignature:50931,ProfileCalibrationSignature:50932,AsShotProfileName:50934,NoiseReductionApplied:50935,ProfileName:50936,ProfileHueSatMapDims:50937,ProfileHueSatMapData1:50938,ProfileHueSatMapData2:50939,ProfileToneCurve:50940,ProfileEmbedPolicy:50941,ProfileCopyright:50942,ForwardMatrix1:50964,ForwardMatrix2:50965,PreviewApplicationName:50966,PreviewApplicationVersion:50967,PreviewSettingsName:50968,PreviewSettingsDigest:50969,PreviewColorSpace:50970,PreviewDateTime:50971,RawImageDigest:50972,OriginalRawFileDigest:50973,SubTileBlockSize:50974,RowInterleaveFactor:50975,ProfileLookTableDims:50981,ProfileLookTableData:50982,OpcodeList1:51008,OpcodeList2:51009,OpcodeList3:51022,NoiseProfile:51041},f.ExifIFD={ExposureTime:33434,FNumber:33437,ExposureProgram:34850,SpectralSensitivity:34852,ISOSpeedRatings:34855,OECF:34856,SensitivityType:34864,StandardOutputSensitivity:34865,RecommendedExposureIndex:34866,ISOSpeed:34867,ISOSpeedLatitudeyyy:34868,ISOSpeedLatitudezzz:34869,ExifVersion:36864,DateTimeOriginal:36867,DateTimeDigitized:36868,ComponentsConfiguration:37121,CompressedBitsPerPixel:37122,ShutterSpeedValue:37377,ApertureValue:37378,BrightnessValue:37379,ExposureBiasValue:37380,MaxApertureValue:37381,SubjectDistance:37382,MeteringMode:37383,LightSource:37384,Flash:37385,FocalLength:37386,SubjectArea:37396,MakerNote:37500,UserComment:37510,SubSecTime:37520,SubSecTimeOriginal:37521,SubSecTimeDigitized:37522,FlashpixVersion:40960,ColorSpace:40961,PixelXDimension:40962,PixelYDimension:40963,RelatedSoundFile:40964,InteroperabilityTag:40965,FlashEnergy:41483,SpatialFrequencyResponse:41484,FocalPlaneXResolution:41486,FocalPlaneYResolution:41487,FocalPlaneResolutionUnit:41488,SubjectLocation:41492,ExposureIndex:41493,SensingMethod:41495,FileSource:41728,SceneType:41729,CFAPattern:41730,CustomRendered:41985,ExposureMode:41986,WhiteBalance:41987,DigitalZoomRatio:41988,FocalLengthIn35mmFilm:41989,SceneCaptureType:41990,GainControl:41991,Contrast:41992,Saturation:41993,Sharpness:41994,DeviceSettingDescription:41995,SubjectDistanceRange:41996,ImageUniqueID:42016,CameraOwnerName:42032,BodySerialNumber:42033,LensSpecification:42034,LensMake:42035,LensModel:42036,LensSerialNumber:42037,Gamma:42240},f.GPSIFD={GPSVersionID:0,GPSLatitudeRef:1,GPSLatitude:2,GPSLongitudeRef:3,GPSLongitude:4,GPSAltitudeRef:5,GPSAltitude:6,GPSTimeStamp:7,GPSSatellites:8,GPSStatus:9,GPSMeasureMode:10,GPSDOP:11,GPSSpeedRef:12,GPSSpeed:13,GPSTrackRef:14,GPSTrack:15,GPSImgDirectionRef:16,GPSImgDirection:17,GPSMapDatum:18,GPSDestLatitudeRef:19,GPSDestLatitude:20,GPSDestLongitudeRef:21,GPSDestLongitude:22,GPSDestBearingRef:23,GPSDestBearing:24,GPSDestDistanceRef:25,GPSDestDistance:26,GPSProcessingMethod:27,GPSAreaInformation:28,GPSDateStamp:29,GPSDifferential:30,GPSHPositioningError:31},f.InteropIFD={InteroperabilityIndex:1},f.GPSHelper={degToDmsRational:function(e){var t=e%1*60,a=t%1*60,i=Math.floor(e),n=Math.floor(t),r=Math.round(100*a);return[[i,1],[n,1],[r,100]]}},"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=f),exports.piexif=f):window.piexif=f}();