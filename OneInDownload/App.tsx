import React from 'react';
import type { PropsWithChildren } from 'react';
import { useState, useEffect } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { Button, Input } from 'react-native-elements';
import Octicons from 'react-native-vector-icons/Octicons'
import Clipboard from '@react-native-clipboard/clipboard';
import { TextInput } from 'react-native-paper';





import {
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert

} from 'react-native';




function App(): JSX.Element {

  const [url, setUrl] = useState('');
  const isInvalidURL = !url.includes('https://www.instagram.com/');
  const isTrim = url.trim() === ""
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handlePaste = async () => {
    const clipboardContent = await Clipboard.getString();
    setUrl(clipboardContent);
  };

  




  const generateUUID = () => {
    return uuidv4();
  };


  const handleDownload = async () => {
    try {
      setIsButtonDisabled(true);

      const response = await fetch(`http://193.164.6.30:3000/api?link=${url}`);
      const data = await response.json();

      let mediaUrl;
      let fileExtension;

      if (data.url) {
        mediaUrl = data.url;
        fileExtension = 'mp4';
        
      } else if (data.thumbnail) {
        mediaUrl = data.thumbnail;
        fileExtension = 'png';
        
      } else {
        console.log('Medya bağlantısı bulunamadı.');
        setIsButtonDisabled(false);
        return;
      }

      const { dirs } = RNFetchBlob.fs;
      const dirToSave = `${dirs.DownloadDir}/`;

      fileExtension = fileExtension.toLowerCase();

      const fileName = `instagram_download_${generateUUID()}.${fileExtension}`;

      const downloadOptions = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: `${dirToSave}${fileName}`,
          description: 'Instagram Video Download'
        }
      };

      RNFetchBlob.config(downloadOptions)
        .fetch('GET', mediaUrl)
        .then((res) => {
          console.log('File downloaded:', res.path());
        })
        .catch((error) => {
          console.error('Download error:', error);
        })
        .finally(() => {
          setTimeout(() => {
            setIsButtonDisabled(false);
          }, 10000);
        });
    } catch (error) {
      console.error('Hata oluştu:', error);
      setIsButtonDisabled(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>


      <TextInput
        error={isInvalidURL}
        mode='outlined'
        activeOutlineColor='pink'
        style={{ width: '80%', height: 40, marginBottom: 10, padding: 5 }}
        placeholder="Paste Instagram post URL"
        value={url}
        onChangeText={(text) => setUrl(text)}
        right={
            <TextInput.Icon icon="content-paste" style={{ marginBottom: -5 }} onPress={handlePaste} />
        }
      />
      {isInvalidURL && !isTrim && <Text style={{ color: 'red', fontSize: 10, marginBottom: 10, marginTop: -10 }}>INVALID URL</Text>}
      <Button
      
        buttonStyle={{backgroundColor: "pink"}}
        title="Download"
        style={{shadowColor: "pink"}}
        onPress={handleDownload}
        disabled={(!url || isInvalidURL) || isButtonDisabled}
        iconPosition='right'
        icon={
          <View style={{ marginLeft: 25 }}>
            <AntDesign name="download" size={20} color="white" style={{ alignSelf: "flex-end" }} />
          </View>
        }

      />

    </View>
  );
};


export default App;





